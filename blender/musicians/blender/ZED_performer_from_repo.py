# ZED · Build or update the performer IN BLENDER straight from the repo (Blender 5.2.2 LTS target; not yet run by its author)
# No GLB, no Python setup: reads ../data/performer_manifest.json next to this script (blender/musicians/data/) and
# builds the 16 parts as clean quad lofts with n-gon end caps, smooth shaded, sharp only at the cap rims.
# Run in the musician LIBRARY file: if PERF_<Part> objects exist, it swaps their meshes in place (names, collections,
# origins and links survive). In an empty file it creates LIB_PERF_Performer. Never deletes. Then press Ctrl+S.
# Text > Open this file > Run Script.
import os, json, math
try:
    import bpy
except ImportError:          # lets the geometry below be tested outside Blender
    bpy = None
import numpy as np

FOLDER = ''   # leave empty: auto-detects ../data from the folder this script was opened from
SIDES = 16
CAP_SHARP_DEG = 50.0
FRONT = np.array([0., -1., 0.]); UP = np.array([0., 0., 1.])

# ---------- geometry (pure numpy; matches source/performer.py) ----------
def nrm(v): v = np.asarray(v, float); return v / np.linalg.norm(v)

def frm(a, b, ref=None):
    R = FRONT if ref is None else np.asarray(ref, float)
    u = nrm(b - a); f = R - np.dot(R, u) * u
    f = nrm(f) if np.linalg.norm(f) > 1e-3 else np.array([0, 0, 1.])
    return u, np.cross(u, f), f

def _pchip_d(x, y):          # scipy PchipInterpolator derivatives (Fritsch-Butland), so the profile matches exactly
    h = np.diff(x); m = np.diff(y) / h
    if len(x) == 2: return np.array([m[0], m[0]])
    d = np.zeros_like(y)
    for k in range(1, len(x) - 1):
        if m[k-1] * m[k] <= 0 or m[k-1] == 0 or m[k] == 0: d[k] = 0.0
        else:
            w1 = 2*h[k] + h[k-1]; w2 = h[k] + 2*h[k-1]
            d[k] = (w1 + w2) / (w1/m[k-1] + w2/m[k])
    def edge(h0, h1, m0, m1):
        e = ((2*h0 + h1)*m0 - h0*m1) / (h0 + h1)
        if np.sign(e) != np.sign(m0): e = 0.0
        elif np.sign(m0) != np.sign(m1) and abs(e) > abs(3*m0): e = 3*m0
        return e
    d[0] = edge(h[0], h[1], m[0], m[1]); d[-1] = edge(h[-1], h[-2], m[-1], m[-2])
    return d

def _pchip(x, y, t):
    x = np.asarray(x, float); y = np.asarray(y, float); d = _pchip_d(x, y)
    k = min(max(np.searchsorted(x, t) - 1, 0), len(x) - 2)
    h = x[k+1] - x[k]; s = (t - x[k]) / h
    h00 = 2*s**3 - 3*s**2 + 1; h10 = s**3 - 2*s**2 + s; h01 = -2*s**3 + 3*s**2; h11 = s**3 - s**2
    return h00*y[k] + h10*h*d[k] + h01*y[k+1] + h11*h*d[k+1]

def densify(rows):
    rows = [tuple(r) + ((0.0,) if len(r) == 3 else ()) for r in rows]
    T = [r[0] for r in rows]
    ts = sorted(set(T + [(a + b)/2 for a, b in zip(T[:-1], T[1:])]))
    return [(t, *(float(_pchip(T, [r[k] for r in rows], t)) for k in (1, 2, 3))) for t in ts]

def rings_for(head, tail, rows, sole_line=None, ref=None, n=SIDES):
    a = np.asarray(head, float); b = np.asarray(tail, float); u, s_, f = frm(a, b, ref); L = np.linalg.norm(b - a); out = []
    for t, w, d, off in densify(rows):
        c = a + t*L*u; ring = []
        for th in np.linspace(0, 2*np.pi, n, endpoint=False) + np.pi/n:
            fc = off + d*np.sin(th)
            if sole_line is not None: fc = max(fc, sole_line[0] + sole_line[1]*t)
            ring.append(c + w*np.cos(th)*s_ + fc*f)
        out.append(np.array(ring))
    return out, u

def quad_loft(rings, u):
    """Quads along the part + one n-gon cap each end. Returns verts (R*n,3) and faces wound outward."""
    R = len(rings); n = len(rings[0]); V = np.concatenate(rings); F = []
    for r in range(R - 1):
        for i in range(n): F.append([r*n + i, r*n + (i+1) % n, (r+1)*n + (i+1) % n, (r+1)*n + i])
    cen = V.mean(0); a, b, c = (V[F[0][k]] for k in range(3))
    if np.dot(np.cross(b - a, c - a), (a + b + c)/3 - cen) < 0: F = [q[::-1] for q in F]
    cap0 = list(range(n)); capL = list(range((R-1)*n, R*n))
    def wind(cap, out_dir):
        p0, p1, p2 = V[cap[0]], V[cap[1]], V[cap[2]]
        return cap if np.dot(np.cross(p1 - p0, p2 - p0), out_dir) > 0 else cap[::-1]
    F += [wind(cap0, -u), wind(capL, u)]
    return V, F

def part_geometry(man):
    rec = man['form_recipe']; fr = man['foot_rows']; sl = man['foot_sole_line']; out = {}
    for name, p in man['parts'].items():
        base = name.split('.')[0]
        if base == 'Foot': rings, u = rings_for(p['head'], p['tail'], fr, sole_line=sl, ref=UP)
        else:              rings, u = rings_for(p['head'], p['tail'], rec[base])
        V, F = quad_loft(rings, u)
        out[name] = (V, F, np.asarray(p['head'], float), p)
    return out

# ---------- Blender side ----------
def say(*a): print('[ZED PERF]', *a)

def manifest_path():
    if FOLDER: base = bpy.path.abspath(FOLDER)
    else:
        base = None
        for t in bpy.data.texts:
            if t.filepath and os.path.basename(t.filepath).startswith('ZED_performer_from_repo'):
                base = os.path.dirname(bpy.path.abspath(t.filepath))
        if base is None: raise RuntimeError('Open this script from disk (Text > Open), or set FOLDER at the top. Nothing was changed.')
    for p in (os.path.join(base, '..', 'data', 'performer_manifest.json'), os.path.join(base, 'data', 'performer_manifest.json'), os.path.join(base, 'performer_manifest.json')):
        if os.path.isfile(p): return p
    raise RuntimeError('performer_manifest.json not found in ../data next to this script. Nothing was changed.')

def material():
    m = bpy.data.materials.get('URITP_PERF_52')
    if m: return m
    m = bpy.data.materials.new('URITP_PERF_52'); g = ((0.52 + 0.055)/1.055)**2.4
    m.diffuse_color = (g, g, g, 1.0); m.roughness = 0.85
    if m.use_nodes and m.node_tree.nodes.get('Principled BSDF'):
        bsdf = m.node_tree.nodes['Principled BSDF']; bsdf.inputs['Base Color'].default_value = (g, g, g, 1.0); bsdf.inputs['Roughness'].default_value = 0.85
    return m

def main():
    from mathutils import Matrix, Vector
    mp = manifest_path(); man = json.load(open(mp)); ver = man.get('version', '?')
    geo = part_geometry(man); mat = material()
    existing = {n: bpy.data.objects.get(f'PERF_{n}') for n in geo}
    updating = any(o is not None for o in existing.values())
    coll = bpy.data.collections.get('LIB_PERF_Performer')
    if not updating:
        if coll is None:
            coll = bpy.data.collections.new('LIB_PERF_Performer'); bpy.context.scene.collection.children.link(coll)
        root = bpy.data.objects.new('PERF_Performer', None); root.empty_display_type = 'ARROWS'; root.empty_display_size = 0.3
        coll.objects.link(root)
    else:
        root = next((o for o in (coll.all_objects if coll else []) if o.type == 'EMPTY' and o.name.startswith('PERF_Performer')), None)
    made, swapped = [], []
    for name, (V, F, head, p) in geo.items():
        me = bpy.data.meshes.new(f'PERF_{name}_v{ver}')
        me.from_pydata([tuple(map(float, v - head)) for v in V], [], [list(map(int, f)) for f in F])
        me.validate(); me.update()
        for poly in me.polygons: poly.use_smooth = True
        try: me.set_sharp_from_angle(angle=math.radians(CAP_SHARP_DEG))
        except Exception as ex: say('sharp-by-angle skipped:', ex)
        me.materials.append(mat)
        ob = existing[name]
        if ob is not None and ob.type == 'MESH':
            ob.data = me; ob.matrix_world = Matrix.Translation(Vector(map(float, head))); swapped.append(name)
        else:
            ob = bpy.data.objects.new(f'PERF_{name}', me); coll.objects.link(ob)
            if root: ob.parent = root
            ob.location = Vector(map(float, head)); made.append(name)
        ob['uritp_part'] = name; ob['uritp_bone_tail'] = [float(x) for x in p['tail']]
        ob['uritp_bone_parent'] = (p['parent'] or '').replace('DEF_', '')
    if root: root['uritp_mesh_version'] = f'{ver} (from repo manifest)'
    if coll and not updating:
        try: coll.asset_mark()
        except Exception as ex: say('asset mark skipped:', ex)
    bpy.context.view_layer.update()
    zs = [(o.matrix_world @ v.co).z for n in geo for o in [bpy.data.objects[f'PERF_{n}']] for v in o.data.vertices]
    nv = sum(len(bpy.data.objects[f'PERF_{n}'].data.vertices) for n in geo)
    lines = [f'Performer v{ver} from repo: ' + (f'swapped {len(swapped)} of 16 parts' if updating else f'created {len(made)} of 16 parts'),
             f'{nv} vertices, quads + end caps, smooth shaded',
             f'Height {max(zs):.3f} m (expect 1.768). Lowest point {min(zs):+.4f} m (expect +0.0000)',
             'Press Ctrl+S to save. Files that link this library pick it up on reload.']
    for l in lines: say(l)
    bpy.context.window_manager.popup_menu(lambda self, ctx: [self.layout.label(text=l) for l in lines], title='ZED · performer from repo', icon='INFO')

if bpy is not None:
    main()
