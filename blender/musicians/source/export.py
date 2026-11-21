# Writes ../dist: one GLB per prop, performer v4.3 (smooth), and the practice-room layout. Blender (Z up) -> glTF (Y up): (x,y,z)->(x,z,-y).
import os, sys, json, struct, pickle, numpy as np
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE); import props as S5
OUT=os.path.join(HERE,'..','dist')

os.makedirs(OUT,exist_ok=True)
G=lambda v: np.array([v[0],v[2],-v[1]],float)
lin=lambda c: ((c+0.055)/1.055)**2.4
MATN=list(S5.MATS.keys())
def glb(path,roots,scene='URITP_Musicians'):
    buf=bytearray();bv=[];acc=[];meshes=[];nodes=[];rootidx=[]
    def push(arr,mm=False):
        o=len(buf);b=arr.tobytes();buf.extend(b);buf.extend(b'\0'*((4-len(buf)%4)%4))
        bv.append(dict(buffer=0,byteOffset=o,byteLength=len(b),target=34962))
        a=dict(bufferView=len(bv)-1,componentType=5126,count=len(arr),type='VEC3')
        if mm: a['min']=arr.min(0).tolist();a['max']=arr.max(0).tolist()
        acc.append(a); return len(acc)-1
    def push_idx(arr):
        o=len(buf);b=arr.tobytes();buf.extend(b);buf.extend(b'\0'*((4-len(buf)%4)%4))
        bv.append(dict(buffer=0,byteOffset=o,byteLength=len(b),target=34963))
        acc.append(dict(bufferView=len(bv)-1,componentType=5125,count=len(arr),type='SCALAR')); return len(acc)-1
    for R in roots:
        kids=[]
        for ob in R['objects']:
            pv=np.asarray(ob['pivot'],float);prims=[]
            for mat,ms in ob['bymat'].items():
                if ob.get('smooth'):   # v4.3: indexed, shared vertices, area-weighted vertex normals -> Blender shades it smooth
                    for V,F in ms:
                        Vg=np.array([G(v-pv) for v in V],np.float32); Nv=np.zeros_like(Vg)
                        for a,b,c in F: Nv[[a,b,c]]+=np.cross(Vg[b]-Vg[a],Vg[c]-Vg[a])
                        Nv/=np.linalg.norm(Nv,axis=1,keepdims=True)+1e-12
                        prims.append(dict(attributes=dict(POSITION=push(Vg,True),NORMAL=push(Nv.astype(np.float32))),indices=push_idx(np.asarray(F,np.uint32).ravel()),material=MATN.index(mat)))
                    continue
                P=[];N=[]
                for V,F in ms:
                    for f in F:
                        t=[G(V[i]-pv) for i in f];n=np.cross(t[1]-t[0],t[2]-t[0]);n/=np.linalg.norm(n)+1e-12;P+=t;N+=[n]*3
                P=np.array(P,np.float32);N=np.array(N,np.float32)
                prims.append(dict(attributes=dict(POSITION=push(P,True),NORMAL=push(N)),material=MATN.index(mat)))
            meshes.append(dict(name=ob['name'],primitives=prims))
            nodes.append(dict(name=ob['name'],mesh=len(meshes)-1,translation=G(pv).tolist(),extras=ob.get('extras',{})));kids.append(len(nodes)-1)
        q=np.radians(R.get('rz',0.0))/2   # rotation about Blender Z == glTF Y
        nodes.append(dict(name=R['name'],children=kids,translation=G(R.get('T',(0,0,0))).tolist(),rotation=[0,float(np.sin(q)),0,float(np.cos(q))],extras=R.get('extras',{})))
        rootidx.append(len(nodes)-1)
    mats=[dict(name=f'URITP_{n}_{int(g*100)}',pbrMetallicRoughness=dict(baseColorFactor=[lin(g)]*3+[1],metallicFactor=0,roughnessFactor=0.85)) for n,g in S5.MATS.items()]
    j=json.dumps(dict(asset=dict(version='2.0',generator='Vertex Vera · URITP musician set v5.0'),scene=0,scenes=[dict(name=scene,nodes=rootidx)],
        nodes=nodes,meshes=meshes,materials=mats,accessors=acc,bufferViews=bv,buffers=[dict(byteLength=len(buf))]),separators=(',',':')).encode()
    j+=b' '*((4-len(j)%4)%4)
    open(path,'wb').write(struct.pack('<III',0x46546C67,2,28+len(j)+len(buf))+struct.pack('<II',len(j),0x4E4F534A)+j+struct.pack('<II',len(buf),0x004E4942)+bytes(buf))
props=pickle.load(open(os.path.join(HERE,'..','build','props','props.pkl'),'rb'))
man=json.load(open(os.path.join(HERE,'..','build','props','set_manifest.json')))
PIV={'Lid':(S5.HINGE_X,1.0,S5.TOP)}
def prop_root(name,T=(0,0,0),rz=0.0,suffix=''):
    code=man['props'][name]['code']
    objs=[dict(name=f'{code}{suffix}_{pn}',bymat=bm,pivot=PIV.get(pn,(0,0,0)),extras=dict(uritp_prop=name,uritp_part=pn)) for pn,bm in props[name].items()]
    return dict(name=f'PROP_{name}{suffix}',objects=objs,T=T,rz=rz,extras=dict(uritp_prop=name,uritp_sockets_json=json.dumps(man['props'][name]['sockets'])))
PERF=pickle.load(open(os.path.join(HERE,'..','build','performer','parts.pkl'),'rb'))
pm=json.load(open(os.path.join(HERE,'..','build','performer','performer_manifest.json')))
def perf_root(T=(0,0,0),rz=0.0):
    objs=[dict(name=f'PERF_{n}',bymat={'PERF':ms},pivot=pv,smooth=True,extras=dict(uritp_part=n,uritp_bone_tail=[float(x) for x in tl],uritp_bone_parent=par or '')) for n,(ms,pv,tl,par) in PERF.items()]
    return dict(name='PERF_Performer_v4_3',objects=objs,T=T,rz=rz,extras=dict(uritp_manifest='performer_manifest.json v4.3'))
glb(os.path.join(OUT,'PERF_Performer_v4_3.glb'),[perf_root()])
for n in props: glb(os.path.join(OUT,f'PROP_{n}_v5_0.glb'),[prop_root(n)])
room=[perf_root((0.2,-0.4,0),25),prop_root('GrandPiano',(-1.6,0.9,0),-20),prop_root('PianoBench',(-1.82,0.30,0),-20),
      prop_root('MelodyChair',(1.1,0.6,0),200),prop_root('MusicStand',(1.25,-0.05,0),20),prop_root('Cello',(1.75,0.75,0),200),prop_root('CelloBow',(1.95,0.85,0),200),
      prop_root('MelodyChair',(0.35,1.5,0),180,'_2'),prop_root('MusicStand',(0.35,0.9,0),0,'_2'),
      prop_root('Guitar',(-0.55,1.9,0),190),prop_root('Footstool',(-0.25,1.5,0),180),prop_root('ViolinBow',(0.75,1.45,0),180)]
glb(os.path.join(OUT,'SET_PracticeRoom_v5_0.glb'),room,'PracticeRoom')
json.dump(man,open(os.path.join(OUT,'set_manifest.json'),'w'),indent=1)
import shutil; shutil.copy(os.path.join(HERE,'..','build','performer','performer_manifest.json'),OUT)
for f in sorted(os.listdir(OUT)):
    p=os.path.join(OUT,f); d=open(p,'rb').read()
    if f.endswith('.glb'):
        jl=struct.unpack('<I',d[12:16])[0]; j=json.loads(d[20:20+jl]); assert d[:4]==b'glTF' and struct.unpack('<I',d[8:12])[0]==len(d)
        print(f,len(d),'B ·',len(j['nodes']),'nodes')
    else: print(f,len(d),'B')
