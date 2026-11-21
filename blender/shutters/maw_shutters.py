# MAW Shutters v0.6 · prototype · Scene Zed · 2026-11-21
# Framing shutters for Cycles spot lights (plain Blender spots or BlenderDMX fixtures).
#
# LINGO (matches Vectorworks + Eos/Augment3d)
#   Vectorworks:  Shutter depth 0-100% (100% cuts through the centre), angle +/-45 deg,
#                 Top / Right / Bottom / Left.
#   Eos:          Frame Thrust A-D, Frame Angle A-D, Frame Assembly.
#                 Augment3d, hung fixture at Pan 0 / Tilt +90: A-Top B-Right C-Bottom D-Left.
#                 Positive angles are counterclockwise.
#   Here:         Rotate (= Eos Frame Assembly) · Top/A Right/B Bottom/C Left/D, each Depth % + Angle · Edge.
#   Keyframe channels read: Shutter Rotate, Shutter Top, Shutter Top Angle, ... Shutter Edge.
#
# SAFE TO RUN: scratch file first. Undo = Ctrl+Z. Re-running rebuilds in place and keeps values.
#
# USE
#   1. Select one or more Spot lights (for a BlenderDMX fixture, select its spot light object).
#   2. Text Editor > Open this file > Run Script.
#   3. 3D Viewport sidebar (N) > "Shutters" tab. Hover a slider + I to keyframe it.
#      Re-run on a v0.2 light and its values move to the new names.
#   4. Render in Cycles. EEVEE ignores light node trees (same as BlenderDMX gobos).
#   Text > Register brings the tab back when the file reopens. Cuts work without it (drivers).
#
# Changes in v0.6: Pull from Vectorworks. Reads the JSON from vwx_dump_lighting_devices.py and stamps each
#   device's Top/Left/Right/Bottom Shutter Depth + Angle onto the nearest spot light (same CL x PL origin as the
#   MVR import), plus Frost from R132/R119/R114 in the Color field. Ghost devices (blank Inst Type) are skipped.
#   Writes a 'VWX pull report' text block listing every match and every unmatched device.
# Changes in v0.5.2: Barrel starts in the middle (sharp) and runs IN (-1) or OUT (+1). Both soften for now;
#   the halo / colour-fringe difference between the two directions comes once it's matched to a real unit.
# Changes in v0.5.1: files flagged by the test open staged: fixture selected, Rendered viewport,
#   camera view, sidebar on the Shutters tab. Opt-in per file (scene flag), show files are never hijacked.
# Changes in v0.5: Edge = Barrel (run the tube, 0 sharp > 1 soft) + Frost (None / R132 / R119 / R114).
#   Both soften the shutter cuts AND the beam edge together, like a real ERS. Frost values are starting
#   points to calibrate by eye against a real unit. Old 'Shutter Edge' values migrate to Barrel.
# Changes in v0.4: renamed Shaper -> Shutters everywhere (tab, node group, file). Old nodes replaced on re-run.
# Changes in v0.3: short channel names (Shutter Top, Shutter Top Angle, Shutter Rotate),
#   Rotate promoted to the top of the panel, compact one-row-per-shutter layout, Open All button,
#   v0.2 values migrate automatically on re-run.
#   Key Fade / Key Snap: record the whole assembly as one look, like a cue. Fade = timed fade in from the
#   previous key (linear, time = gap between keys). Snap = previous look holds, this one snaps in. Block key covers Rotate, Edge, all 8 blade values,
#   grouped as "Shutters" so the Dope Sheet shows one row you can move as a unit.
# Changes from v0.1: VWX/Eos naming, depth/angle model instead of A/B ends,
#   fixed Right/Left (v0.1 had them swapped), Flip now off by default
#   (cuts are named where they land in the beam, like Vectorworks).

import bpy

VERSION = "0.6"
GROUP = "MAW_Shutters"
OLD_NODES = ("MAW_ShaperApply", "MAW_Shaper", "MAW_ShaperUV")   # v0.1-v0.3 names
DEG = 0.017453292519943295
# shutter key, Eos letter, label, frame angle that brings this side to the top
SHUTTERS = [("top", "A", "Top", 0.0), ("right", "B", "Right", 90.0),
            ("bottom", "C", "Bottom", 180.0), ("left", "D", "Left", -90.0)]

P_ROT, P_EDGE, P_FLIP = "Shutter Rotate", "Shutter Edge", "Shutter Flip"   # P_EDGE: v0.3-v0.4 only
P_BARREL, P_FROST = "Shutter Barrel", "Shutter Frost"

# Frost: (label, edge half-width in beam radii). STARTING VALUES: calibrate by eye at a real focus.
FROST = [("None", 0.0), ("R132", 0.03), ("R119", 0.06), ("R114", 0.12)]
FROST_NAMES = {0: "none", 1: "Rosco 132 Quarter Hamburg Frost", 2: "Rosco 119 Light Hamburg Frost", 3: "Rosco 114 Hamburg Frost"}
BARREL_MAX = 0.15          # edge half-width with the barrel run all the way IN or OUT
EDGE_MIN = 0.003           # sharpest focus
def P_DEPTH(label): return f"Shutter {label}"
def P_ANGLE(label): return f"Shutter {label} Angle"

PROPS = {
    P_ROT: (0.0, -45.0, 45.0, "Rotate the whole shutter assembly, deg, + = CCW. Eos: Frame Assembly"),
    P_BARREL: (0.0, -1.0, 1.0, "Barrel: 0 = sharp (middle). Run the tube IN (-1) or OUT (+1) to soften"),
    P_FROST: (0, 0, 3, "Frost in the gel frame: 0 None, 1 R132, 2 R119, 3 R114"),
    P_FLIP: (0, 0, 1, "Optical flip: name blades where they sit, not where they cut"),
}
for key, letter, label, _ in SHUTTERS:
    PROPS[P_DEPTH(label)] = (0.0, 0.0, 100.0, f"{label} ({letter}) depth %, 100 = centre. Eos: Frame Thrust {letter}")
    PROPS[P_ANGLE(label)] = (0.0, -45.0, 45.0, f"{label} ({letter}) angle deg, + = CCW. Eos: Frame Angle {letter}")

# v0.2 names -> v0.3 names
LEGACY = {"shaper_frame": P_ROT, "shaper_edge": P_EDGE, "shaper_flip": P_FLIP}   # shaper_edge -> Edge -> Barrel
for key, letter, label, _ in SHUTTERS:
    LEGACY[f"shaper_{key}_depth"] = P_DEPTH(label)
    LEGACY[f"shaper_{key}_angle"] = P_ANGLE(label)


def _math(N, op, a=None, b=None, c=None):
    m = N.new("ShaderNodeMath"); m.operation = op; m.use_clamp = False
    for i, v in enumerate((a, b, c)):
        if isinstance(v, (int, float)):
            m.inputs[i].default_value = v
    return m


def build_group():
    ng = bpy.data.node_groups.get(GROUP) or bpy.data.node_groups.new(GROUP, "ShaderNodeTree")
    ng.nodes.clear(); ng.interface.clear()

    def sock(name, kind, default=None, out=False):
        s = ng.interface.new_socket(name=name, in_out="OUTPUT" if out else "INPUT", socket_type=kind)
        if default is not None:
            s.default_value = default
        return s

    sock("UV", "NodeSocketVector")
    sock("Rotate", "NodeSocketFloat", 0.0)
    sock("Edge", "NodeSocketFloat", 0.02)
    sock("Flip", "NodeSocketFloat", 0.0)
    for key, letter, label, _ in SHUTTERS:
        sock(f"{label} Depth", "NodeSocketFloat", 0.0)   # 0..1 (= % / 100)
        sock(f"{label} Angle", "NodeSocketFloat", 0.0)   # radians
    sock("Factor", "NodeSocketFloat", out=True)

    N, L = ng.nodes, ng.links
    gin = N.new("NodeGroupInput"); gout = N.new("NodeGroupOutput")

    # p = (UV - 0.5) * 2 : beam centre 0, beam edge +/-1
    sub = N.new("ShaderNodeVectorMath"); sub.operation = "SUBTRACT"
    sub.inputs[1].default_value = (0.5, 0.5, 0.0)
    L.new(gin.outputs["UV"], sub.inputs[0])
    scl = N.new("ShaderNodeVectorMath"); scl.operation = "SCALE"
    scl.inputs["Scale"].default_value = 2.0
    L.new(sub.outputs[0], scl.inputs[0])

    # optical flip = 180 deg point inversion: p *= (1 - 2*Flip)
    k = _math(N, "MULTIPLY_ADD", None, -2.0, 1.0); L.new(gin.outputs["Flip"], k.inputs[0])
    flip = N.new("ShaderNodeVectorMath"); flip.operation = "SCALE"
    L.new(scl.outputs[0], flip.inputs[0]); L.new(k.outputs[0], flip.inputs["Scale"])

    # Rotate (Frame Assembly): rotating the frame CCW = rotating the sample point CW
    nf = _math(N, "MULTIPLY", None, -1.0); L.new(gin.outputs["Rotate"], nf.inputs[0])
    rot = N.new("ShaderNodeVectorRotate"); rot.rotation_type = "Z_AXIS"
    rot.inputs["Center"].default_value = (0.0, 0.0, 0.0)
    L.new(flip.outputs[0], rot.inputs["Vector"]); L.new(nf.outputs[0], rot.inputs["Angle"])

    soft = _math(N, "MAXIMUM", None, 0.001); L.new(gin.outputs["Edge"], soft.inputs[0])
    nsoft = _math(N, "MULTIPLY", None, -1.0); L.new(soft.outputs[0], nsoft.inputs[0])

    total = None
    for key, letter, label, ang in SHUTTERS:
        br = N.new("ShaderNodeVectorRotate"); br.rotation_type = "Z_AXIS"
        br.inputs["Center"].default_value = (0.0, 0.0, 0.0)
        br.inputs["Angle"].default_value = ang * DEG
        L.new(rot.outputs[0], br.inputs["Vector"])
        sep = N.new("ShaderNodeSeparateXYZ"); L.new(br.outputs[0], sep.inputs[0])

        # edge through (0, 1 - depth), slope tan(angle): y_edge = 1 - D + tan(a) * x
        tan = _math(N, "TANGENT"); L.new(gin.outputs[f"{label} Angle"], tan.inputs[0])
        tx = _math(N, "MULTIPLY"); L.new(tan.outputs[0], tx.inputs[0]); L.new(sep.outputs["X"], tx.inputs[1])
        base = _math(N, "SUBTRACT", 1.0); L.new(gin.outputs[f"{label} Depth"], base.inputs[1])
        edge = _math(N, "ADD"); L.new(base.outputs[0], edge.inputs[0]); L.new(tx.outputs[0], edge.inputs[1])
        d = _math(N, "SUBTRACT"); L.new(sep.outputs["Y"], d.inputs[0]); L.new(edge.outputs[0], d.inputs[1])

        mr = N.new("ShaderNodeMapRange")
        mr.data_type = "FLOAT"; mr.interpolation_type = "SMOOTHSTEP"; mr.clamp = True
        L.new(d.outputs[0], mr.inputs["Value"])
        L.new(nsoft.outputs[0], mr.inputs["From Min"]); L.new(soft.outputs[0], mr.inputs["From Max"])
        mr.inputs["To Min"].default_value = 1.0; mr.inputs["To Max"].default_value = 0.0

        if total is None:
            total = mr.outputs["Result"]
        else:
            mul = _math(N, "MULTIPLY"); L.new(total, mul.inputs[0]); L.new(mr.outputs["Result"], mul.inputs[1])
            total = mul.outputs[0]
    L.new(total, gout.inputs["Factor"])
    return ng


def ensure_props(obj):
    for old, new in LEGACY.items():            # carry v0.2 values over, then drop the old names
        if old in obj:
            if new not in obj:
                obj[new] = obj[old]
            del obj[old]
    if P_EDGE in obj:                          # v0.3-v0.4 Edge -> v0.5 Barrel
        if P_BARREL not in obj:
            obj[P_BARREL] = max(0.0, min(1.0, float(obj[P_EDGE]) / BARREL_MAX))
        del obj[P_EDGE]
    for name, (default, lo, hi, desc) in PROPS.items():
        if name not in obj:
            obj[name] = default
        obj.id_properties_ui(name).update(min=lo, max=hi, soft_min=lo, soft_max=hi, description=desc)


def drive(socket, obj, prop, expr="var"):
    socket.driver_remove("default_value")
    drv = socket.driver_add("default_value").driver
    drv.type = "SCRIPTED"
    v = drv.variables.new(); v.name = "var"; v.type = "SINGLE_PROP"
    v.targets[0].id_type = "OBJECT"; v.targets[0].id = obj; v.targets[0].data_path = f'["{prop}"]'
    drv.expression = expr


def drive_expr(owner, path, obj, variables, expr):
    """Scripted driver with several object props as variables. Expressions stay in Blender's
    'simple expression' subset, so they run without Auto Run Python Scripts."""
    owner.driver_remove(path)
    drv = owner.driver_add(path).driver
    drv.type = "SCRIPTED"
    for vname, prop in variables.items():
        v = drv.variables.new(); v.name = vname; v.type = "SINGLE_PROP"
        v.targets[0].id_type = "OBJECT"; v.targets[0].id = obj; v.targets[0].data_path = f'["{prop}"]'
    drv.expression = expr


def edge_expr():
    (_, f1), (_, f2), (_, f3) = FROST[1], FROST[2], FROST[3]
    frost = f"({f3} if f > 2.5 else ({f2} if f > 1.5 else ({f1} if f > 0.5 else 0.0)))"
    # barrel and frost blur add in quadrature, like two blurs stacked
    return f"max({EDGE_MIN}, sqrt((b * {BARREL_MAX}) * (b * {BARREL_MAX}) + {frost} * {frost}))"


def apply_to(obj, ng=None):
    ng = ng or build_group()
    light = obj.data
    light.use_nodes = True
    nt = light.node_tree
    emission = next((n for n in nt.nodes if n.type == "EMISSION"), None)
    if emission is None:
        return f"{obj.name}: no Emission node, skipped"
    color_in = emission.inputs["Color"]

    apply = nt.nodes.get("MAW_ShuttersApply") or nt.nodes.get("MAW_ShaperApply")
    src, base = None, tuple(color_in.default_value)[:3]
    if apply is not None:
        if apply.inputs[0].is_linked:
            src = apply.inputs[0].links[0].from_socket
        else:
            base = tuple(apply.inputs[0].default_value)
    elif color_in.is_linked:
        src = color_in.links[0].from_socket
    for name in ("MAW_ShuttersApply", "MAW_Shutters", "MAW_ShuttersUV") + OLD_NODES:
        old = nt.nodes.get(name)
        if old is not None:
            nt.nodes.remove(old)

    geo = nt.nodes.new("ShaderNodeNewGeometry"); geo.name = "MAW_ShuttersUV"
    grp = nt.nodes.new("ShaderNodeGroup"); grp.name = "MAW_Shutters"; grp.node_tree = ng
    app = nt.nodes.new("ShaderNodeVectorMath"); app.name = "MAW_ShuttersApply"; app.operation = "SCALE"
    x, y = emission.location
    geo.location, grp.location, app.location = (x - 700, y - 300), (x - 450, y - 300), (x - 200, y - 150)
    nt.links.new(geo.outputs["Parametric"], grp.inputs["UV"])
    if src is not None:
        nt.links.new(src, app.inputs[0])
    else:
        app.inputs[0].default_value = base
    nt.links.new(grp.outputs["Factor"], app.inputs["Scale"])
    nt.links.new(app.outputs[0], color_in)

    ensure_props(obj)
    drive(grp.inputs["Rotate"], obj, P_ROT, f"var*{DEG}")
    drive_expr(grp.inputs["Edge"], "default_value", obj, {"b": P_BARREL, "f": P_FROST}, edge_expr())
    # same softness on the beam edge itself (Blender spot blend), so cuts and beam match
    drive_expr(light, "spot_blend", obj, {"b": P_BARREL, "f": P_FROST}, f"min(1.0, 2.0 * {edge_expr()})")
    drive(grp.inputs["Flip"], obj, P_FLIP)
    for key, letter, label, _ in SHUTTERS:
        drive(grp.inputs[f"{label} Depth"], obj, P_DEPTH(label), "var*0.01")
        drive(grp.inputs[f"{label} Angle"], obj, P_ANGLE(label), f"var*{DEG}")
    return f"{obj.name}: shutters on"


def set_cut(obj, rotate=None, edge=None, frame=None, barrel=None, frost=None, **shutters):
    """set_cut(light, top=(40, 10), left=(25, 0), rotate=5)  ->  depth %, angle deg"""
    rotate = frame if rotate is None else rotate     # 'frame' kept for v0.2 callers
    if rotate is not None:
        obj[P_ROT] = float(rotate)
    if edge is not None and barrel is None:          # v0.4 callers: edge half-width -> barrel
        barrel = float(edge) / BARREL_MAX
    if barrel is not None:
        obj[P_BARREL] = max(-1.0, min(1.0, float(barrel)))
    if frost is not None:
        obj[P_FROST] = int(frost)
    for key, letter, label, _ in SHUTTERS:
        val = shutters.get(key, shutters.get(letter))
        if val is not None:
            obj[P_DEPTH(label)], obj[P_ANGLE(label)] = float(val[0]), float(val[1])


ANIMATED = [P_ROT, P_BARREL, P_FROST] + [p for _, _, label, _ in SHUTTERS for p in (P_DEPTH(label), P_ANGLE(label))]


def _fcurves(obj):
    """Every F-curve on the object's action. Blender 5.x layered actions first, legacy last."""
    ad = obj.animation_data
    if ad is None or ad.action is None:
        return []
    act, out = ad.action, []
    try:
        from bpy_extras import anim_utils
        cb = anim_utils.action_get_channelbag_for_slot(act, ad.action_slot)
        if cb is not None:
            out = list(cb.fcurves)
    except Exception:
        pass
    if not out:
        for layer in getattr(act, "layers", []):
            for strip in getattr(layer, "strips", []):
                for cb in getattr(strip, "channelbags", []):
                    out.extend(cb.fcurves)
    if not out:
        out = list(getattr(act, "fcurves", []) or [])
    return out


SNAP_TYPE = "EXTREME"     # snap-in keys show as the big red diamond in the Dope Sheet


def key_shutters(obj, frame=None, snap=False):
    """Record the whole assembly as one look at this frame, like recording a cue.
    Fade: fades in from the previous key (linear by default, time = gap between keys).
    Snap: the previous look holds, then this one snaps in (0 count). Snap keys = red diamonds.
    Only the two segments touching this key are changed; curves you shaped elsewhere stay yours.
    A Fade keeps any curve shape the incoming segment already had, unless it was a snap hold."""
    frame = bpy.context.scene.frame_current if frame is None else frame
    paths = [f'["{p}"]' for p in ANIMATED]
    existed = {fc.data_path: any(abs(kp.co[0] - frame) < 0.5 for kp in fc.keyframe_points)
               for fc in _fcurves(obj) if fc.data_path in paths}
    for dp in paths:
        obj.keyframe_insert(data_path=dp, frame=frame, group="Shutters")
    n = 0
    for fc in _fcurves(obj):
        if fc.data_path not in paths:
            continue
        kps = sorted(fc.keyframe_points, key=lambda kp: kp.co[0])
        idx = next((i for i, kp in enumerate(kps) if abs(kp.co[0] - frame) < 0.5), None)
        if idx is None:
            continue
        new = kps[idx]
        prev = kps[idx - 1] if idx > 0 else None
        nxt = kps[idx + 1] if idx + 1 < len(kps) else None
        new.type = SNAP_TYPE if snap else "KEYFRAME"
        if prev is not None:
            if snap:
                prev.interpolation = "CONSTANT"
            elif prev.interpolation == "CONSTANT":
                prev.interpolation = "LINEAR"
        if nxt is not None and nxt.type == SNAP_TYPE:
            new.interpolation = "CONSTANT"
        elif not existed.get(fc.data_path, False):
            new.interpolation = "LINEAR"
        fc.update()
        n += 1
    return n


class MAW_OT_shutter_key(bpy.types.Operator):
    """Record the whole shutter assembly as one look at the playhead (one block in the Dope Sheet)"""
    bl_idname = "maw.shutter_key"
    bl_label = "Key Fade"
    bl_options = {"REGISTER", "UNDO"}
    snap: bpy.props.BoolProperty(name="Snap", description="Snap in: the previous look holds, then this look lands on this frame (0 count)", default=False)

    def execute(self, context):
        o = context.active_object
        if o is None or P_DEPTH("Top") not in o:
            return {"CANCELLED"}
        n = key_shutters(o, snap=self.snap)
        if n == 0:
            self.report({"WARNING"}, f"Shutters v{VERSION}: keys made but no curves found. Screenshot this for Zed.")
        else:
            self.report({"INFO"}, f"Shutters v{VERSION}: {n} channels keyed, " + ("SNAP in" if self.snap else "FADE in"))
        return {"FINISHED"}


class MAW_OT_shutter_frost(bpy.types.Operator):
    """Drop frost in the gel frame"""
    bl_idname = "maw.shutter_frost"
    bl_label = "Frost"
    bl_options = {"REGISTER", "UNDO"}
    value: bpy.props.IntProperty(min=0, max=3)

    @classmethod
    def description(cls, context, props):
        return f"Frost: {FROST_NAMES[props.value]}"

    def execute(self, context):
        o = context.active_object
        if o is None or P_FROST not in o:
            return {"CANCELLED"}
        o[P_FROST] = self.value
        o.update_tag()
        return {"FINISHED"}


class MAW_OT_shutter_open(bpy.types.Operator):
    """Pull all four shutters out (depth 0, angle 0). Rotate and Edge stay."""
    bl_idname = "maw.shutter_open"
    bl_label = "Open All"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        o = context.active_object
        if o is None or P_DEPTH("Top") not in o:
            return {"CANCELLED"}
        set_cut(o, **{k: (0, 0) for k, *_ in SHUTTERS})
        o.update_tag()
        return {"FINISHED"}


class MAW_PT_shutters(bpy.types.Panel):
    bl_label = "Shutters v0.6"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Shutters"

    @classmethod
    def poll(cls, context):
        o = context.active_object
        return o is not None and P_DEPTH("Top") in o

    def draw(self, context):
        o, lay = context.active_object, self.layout
        lay.prop(o, f'["{P_ROT}"]', text="Rotate", slider=True)
        grid = lay.column(align=True)
        head = grid.row(align=True).split(factor=0.25)
        head.label(text="")
        cols = head.row(align=True); cols.label(text="Depth %"); cols.label(text="Angle")
        for key, letter, label, _ in SHUTTERS:
            row = grid.row(align=True).split(factor=0.25)
            row.label(text=f"{letter}  {label}")
            r = row.row(align=True)
            r.prop(o, f'["{P_DEPTH(label)}"]', text="", slider=True)
            r.prop(o, f'["{P_ANGLE(label)}"]', text="", slider=True)
        edge = lay.box()
        edge.label(text="Edge")
        edge.prop(o, f'["{P_BARREL}"]', text="Barrel", slider=True)
        hint = edge.row(align=True)
        hint.label(text="◀ IN"); hint.label(text="sharp"); hint.label(text="OUT ▶")
        fr = edge.row(align=True)
        cur = int(o.get(P_FROST, 0))
        for i, (label, _) in enumerate(FROST):
            op = fr.operator("maw.shutter_frost", text=label, depress=(cur == i))
            op.value = i
        row = lay.row(align=True)
        row.scale_y = 1.4
        row.operator("maw.shutter_key", text="Key Fade", icon="IPO_LINEAR").snap = False
        row.operator("maw.shutter_key", text="Key Snap", icon="IPO_CONSTANT").snap = True
        row = lay.row(align=True)
        row.operator("maw.shutter_open", icon="LOOP_BACK")
        row.prop(o, f'["{P_FLIP}"]', text="Flip")


# ---------------------------------------------------------------- Pull from Vectorworks (v0.6)
import json, re as _re
from mathutils import Vector
from bpy_extras.io_utils import ImportHelper

FROST_CODE = {"R132": 1, "R119": 2, "R114": 3}      # diffusion in the VWX Color field -> Frost buttons


def _num(s):
    m = _re.match(r"\s*(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)", str(s), _re.I)
    return float(m.group(1)) if m else 0.0


def _length_m(s):
    """VWX length strings -> metres: 7.5' (feet), 90" (inches), 2286mm, 228.6cm, 2.286m."""
    t = str(s).strip().lower()
    v = _num(t)
    if t.endswith("'"):
        return v * 0.3048
    if t.endswith('"'):
        return v * 0.0254
    if t.endswith("mm"):
        return v / 1000.0
    if t.endswith("cm"):
        return v / 100.0
    return v                                          # bare number or 'm': already metres


def vwx_devices(path):
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    devs, ghosts = [], 0
    for d in data.get("devices", []):
        f = d.get("fields", {})
        if not str(f.get("Inst Type", "")).strip():
            ghosts += 1                               # blank type + blank symbol: nothing to pull
            continue
        loc = tuple(_length_m(f.get(k, 0)) for k in ("X Location", "Y Location", "Z Location"))
        cuts = {}
        for _, _, label, _ in SHUTTERS:
            dep = max(0.0, min(100.0, _num(f.get(f"{label} Shutter Depth", 0))))
            ang = max(-45.0, min(45.0, _num(f.get(f"{label} Shutter Angle", 0))))
            cuts[label] = (dep, ang)
        color = str(f.get("Color", "")).strip().upper()
        frost = next((v for k, v in FROST_CODE.items() if _re.search(rf"\b{k}\b", color)), None)
        devs.append(dict(type=f.get("Inst Type", ""), unit=f.get("Unit Number", ""), position=f.get("Position", ""),
                         uid=f.get("UID", ""), loc=loc, cuts=cuts, frost=frost, color=color))
    return data.get("file", "?"), devs, ghosts


def pull_from_vwx(path, lights=None, tol=0.75):
    """Match every VWX device to the nearest spot light within tol metres (one-to-one) and stamp its cuts."""
    fname, devs, ghosts = vwx_devices(path)
    if lights is None:
        lights = [o for o in bpy.context.scene.objects if o.type == "LIGHT" and o.data.type == "SPOT"]
    pairs = []
    for i, d in enumerate(devs):
        p = Vector(d["loc"])
        for j, o in enumerate(lights):
            dist = (o.matrix_world.translation - p).length
            if dist <= tol:
                pairs.append((dist, i, j))
    pairs.sort()
    used_d, used_l, matched = set(), set(), []
    for dist, i, j in pairs:
        if i in used_d or j in used_l:
            continue
        used_d.add(i); used_l.add(j)
        matched.append((devs[i], lights[j], dist))
    for d, o, dist in matched:
        apply_to(o)
        set_cut(o, frost=d["frost"], **{label.lower(): d["cuts"][label] for _, _, label, _ in SHUTTERS})
        o["Shutter Source"] = f"VWX · {d['type']} · {d['position'] or 'no position'} · unit {d['unit'] or '?'}"
    unmatched = [d for i, d in enumerate(devs) if i not in used_d]
    with_cut = sum(1 for d, _, _ in matched if any(v[0] or v[1] for v in d["cuts"].values()))
    with_frost = sum(1 for d, _, _ in matched if d["frost"] is not None)
    lines = [f"VWX pull · {fname} · Shutters v{VERSION}",
             f"devices {len(devs)} typed · {ghosts} ghost (blank Inst Type, skipped) · spots in scene {len(lights)}",
             f"matched {len(matched)} (within {tol} m) · with cuts {with_cut} · with frost {with_frost} · unmatched {len(unmatched)}",
             "", "MATCHED"]
    for d, o, dist in matched:
        cut = ", ".join(f"{k} {v[0]:g}%/{v[1]:g}°" for k, v in d["cuts"].items() if v[0] or v[1]) or "open"
        lines.append(f"  {o.name} <- {d['type']} · {d['position'] or '-'} u{d['unit'] or '?'} · {cut}"
                     + (f" · frost {FROST[d['frost']][0]}" if d["frost"] is not None else "") + f" · {dist:.2f} m")
    lines += ["", "UNMATCHED (no spot within range)"]
    lines += [f"  {d['type']} · {d['position'] or '-'} u{d['unit'] or '?'} · at {tuple(round(c, 2) for c in d['loc'])}"
              for d in unmatched]
    lines += ["", "CALIBRATION: VWX angle sign vs ours is unverified; check one angled cut against the VWX render."]
    return dict(file=fname, devices=len(devs), ghosts=ghosts, matched=len(matched), with_cut=with_cut,
                with_frost=with_frost, unmatched=unmatched, pairs=matched, text="\n".join(lines))


class MAW_OT_shutter_pull(bpy.types.Operator, ImportHelper):
    """Read the Vectorworks dump and stamp every device's shutter cuts + frost onto the matching spot light"""
    bl_idname = "maw.shutter_pull"
    bl_label = "Pull from Vectorworks"
    bl_options = {"REGISTER", "UNDO"}
    filename_ext = ".json"
    filter_glob: bpy.props.StringProperty(default="*.json", options={"HIDDEN"})
    tolerance: bpy.props.FloatProperty(name="Match distance (m)", default=0.75, min=0.05, max=5.0)

    def execute(self, context):
        r = pull_from_vwx(self.filepath, tol=self.tolerance)
        txt = bpy.data.texts.get("VWX pull report") or bpy.data.texts.new("VWX pull report")
        txt.clear(); txt.write(r["text"])
        self.report({"INFO"}, f"Shutters v{VERSION}: {r['matched']} lights pulled ({r['with_cut']} cut, "
                              f"{r['with_frost']} frost) · {len(r['unmatched'])} unmatched · report in Text Editor")
        return {"FINISHED"}


class MAW_PT_shutters_vwx(bpy.types.Panel):
    bl_label = "Vectorworks"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Shutters"

    def draw(self, context):
        col = self.layout.column()
        col.operator("maw.shutter_pull", icon="IMPORT")
        col.label(text="Matches spots by position (MVR origin)")


CLASSES = (MAW_OT_shutter_key, MAW_OT_shutter_frost, MAW_OT_shutter_open, MAW_OT_shutter_pull, MAW_PT_shutters, MAW_PT_shutters_vwx)


OLD_CLASS_NAMES = ("MAW_PT_shaper", "MAW_PT_shutters", "MAW_OT_shutter_key", "MAW_OT_shutter_open", "MAW_OT_shutter_frost", "MAW_OT_shutter_pull", "MAW_PT_shutters_vwx")


def register():
    for name in OLD_CLASS_NAMES:                       # v0.1-v0.4 panels/buttons still loaded this session
        old = getattr(bpy.types, name, None)
        if old is not None:
            try:
                bpy.utils.unregister_class(old)
            except RuntimeError:
                pass
    for t in bpy.data.texts:                           # old embedded tool would re-register on next open
        if t.name.startswith("maw_shaper") and t.use_module:
            t.use_module = False
    for c in CLASSES:
        bpy.utils.register_class(c)


STAGE_FLAG = "maw_shutters_stage_on_open"   # scene prop: name of the object to stage on open


def stage_view(screens=None, category="Shutters"):
    """Rendered viewport, camera view, sidebar open on the Shutters tab. Returns areas staged."""
    if screens is None:
        wm = bpy.context.window_manager
        screens = [w.screen for w in wm.windows] if wm and wm.windows else []
    n = 0
    for scr in screens:
        for area in scr.areas:
            if area.type != "VIEW_3D":
                continue
            sp = area.spaces.active
            sp.shading.type = "RENDERED"
            sp.show_region_ui = True
            if sp.region_3d is not None and bpy.context.scene.camera is not None:
                sp.region_3d.view_perspective = "CAMERA"
            for reg in area.regions:
                if reg.type == "UI":
                    try:
                        reg.active_panel_category = category
                    except Exception:
                        pass      # older builds: click the Shutters tab once, the file remembers it
            n += 1
    return n


def select_only(obj):
    vl = bpy.context.view_layer or bpy.context.scene.view_layers[0]
    for o in vl.objects:
        o.select_set(False)
    obj.select_set(True)
    vl.objects.active = obj


def _stage_on_open():
    sc = bpy.context.scene
    name = sc.get(STAGE_FLAG) if sc else None
    obj = bpy.data.objects.get(name) if name else None
    if obj is not None:
        select_only(obj)
        stage_view()
    return None          # one shot


def run():
    register()
    spots = [o for o in bpy.context.selected_objects if o.type == "LIGHT" and o.data.type == "SPOT"]
    if not spots:
        print("MAW Shutters: select at least one Spot light, then run again.")
        return
    ng = build_group()
    for o in spots:
        print("MAW Shutters:", apply_to(o, ng))
    old = bpy.data.node_groups.get("MAW_Shaper")
    if old is not None and old.users == 0:
        bpy.data.node_groups.remove(old)


if __name__ == "__main__":
    run()
elif __name__.endswith(".py"):
    # Loaded as a registered text block when a .blend opens (Text > Register): bring the tab back,
    # then stage the view if this file asked for it (the test scene does).
    register()
    bpy.app.timers.register(_stage_on_open, first_interval=0.3)
