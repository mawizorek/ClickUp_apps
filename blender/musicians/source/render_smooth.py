"""Preview renderer with true smooth shading (z-buffer, interpolated vertex normals). Not Blender, but shows what Blender's smooth shading will look like.
Usage: python source/render_smooth.py <old parts.pkl> <new parts.pkl> <out.png>   (parts.pkl files come from source/performer.py in build/performer/)"""
import numpy as np, pickle, sys
from PIL import Image, ImageDraw, ImageFont
def vnormals(V,F):
    N=np.zeros_like(V)
    for a,b,c in F: N[[a,b,c]]+=np.cross(V[b]-V[a],V[c]-V[a])
    return N/(np.linalg.norm(N,axis=1,keepdims=True)+1e-12)
def render(P,azim,elev,smooth,W=520,H=900,scale=440,zc=0.86):
    az=np.radians(azim); el=np.radians(elev)
    Rz=np.array([[np.cos(az),-np.sin(az),0],[np.sin(az),np.cos(az),0],[0,0,1]])
    Rx=np.array([[1,0,0],[0,np.cos(el),-np.sin(el)],[0,np.sin(el),np.cos(el)]])
    R=Rx@Rz  # camera looks along +Y after rotation (from -Y side)
    L=np.array([-0.45,-0.75,0.5]); L=L/np.linalg.norm(L)
    img=np.zeros((H,W,3))+np.array([0.09,0.09,0.11]); zb=np.full((H,W),np.inf)
    for n,(ms,*_) in P.items():
        for V,F in ms:
            N=vnormals(V,F); Vc=V@R.T; Nc=N@R.T; Lc=R@L
            sx=W/2+Vc[:,0]*scale; sy=H/2+30-(Vc[:,2]-zc)*scale; dep=Vc[:,1]
            for f in F:
                x=sx[f];y=sy[f]
                x0,x1=int(max(0,np.floor(x.min()))),int(min(W-1,np.ceil(x.max()))); y0,y1=int(max(0,np.floor(y.min()))),int(min(H-1,np.ceil(y.max())))
                if x1<x0 or y1<y0: continue
                fn=np.cross(Vc[f[1]]-Vc[f[0]],Vc[f[2]]-Vc[f[0]])
                if fn[1]>0: continue  # backface (facing away from camera at -Y)
                X,Y=np.meshgrid(np.arange(x0,x1+1)+0.5,np.arange(y0,y1+1)+0.5)
                d=(y[1]-y[2])*(x[0]-x[2])+(x[2]-x[1])*(y[0]-y[2])
                if abs(d)<1e-9: continue
                w0=((y[1]-y[2])*(X-x[2])+(x[2]-x[1])*(Y-y[2]))/d; w1=((y[2]-y[0])*(X-x[2])+(x[0]-x[2])*(Y-y[2]))/d; w2=1-w0-w1
                m=(w0>=-1e-6)&(w1>=-1e-6)&(w2>=-1e-6)
                if not m.any(): continue
                z=w0*dep[f[0]]+w1*dep[f[1]]+w2*dep[f[2]]
                sub=zb[y0:y1+1,x0:x1+1]; m&=z<sub
                if not m.any(): continue
                if smooth: nn=w0[...,None]*Nc[f[0]]+w1[...,None]*Nc[f[1]]+w2[...,None]*Nc[f[2]]
                else: nn=np.broadcast_to(-fn/np.linalg.norm(fn) if False else fn/np.linalg.norm(fn),X.shape+(3,))
                nn=nn/(np.linalg.norm(nn,axis=-1,keepdims=True)+1e-12)
                lam=np.clip((nn*Lc).sum(-1),0,1); rim=np.clip(1-np.abs(nn[...,1]),0,1)**3*0.12
                c=0.56*(0.2+0.8*lam)+rim
                sub[m]=z[m]; blk=img[y0:y1+1,x0:x1+1]; blk[m]=np.stack([c,c,c*1.03],-1)[m]
    return (np.clip(img,0,1)*255).astype(np.uint8)
A=pickle.load(open(sys.argv[1],'rb')); B=pickle.load(open(sys.argv[2],'rb'))
views=[(A,-35,8,False,'v4.2 · what Blender showed (flat)'),(B,-35,8,True,'v4.3 · in Blender (smooth)'),(B,0,6,True,'v4.3 · front'),(B,-90,6,True,'v4.3 · side')]
tiles=[]
for P,az,el,sm,lab in views:
    im=Image.fromarray(render(P,az,el,sm)); d=ImageDraw.Draw(im)
    try: fnt=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
    except: fnt=None
    d.text((20,14),lab,fill=(220,220,225),font=fnt); tiles.append(im)
out=Image.new('RGB',(520*4,900)); [out.paste(t,(i*520,0)) for i,t in enumerate(tiles)]; out.save(sys.argv[3])
