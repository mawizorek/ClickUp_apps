# ZED · Blocking stand-in (Blender 5.2.2 LTS target; not yet run by its author)
# Makes a swappable stand-in for blocking: you ANIMATE THE MOVER (an empty), never the box.
# Later, parent the real performer (linked instance or rig) to the same mover and every blocking key carries over.
# Run in your SHOW / assembly file. Change NAME for each character. Runs once per NAME; deletes nothing.
import bpy, bmesh
from mathutils import Vector

NAME = 'Lead'          # character name -> BLK_Lead_MOVE, BLK_Lead_STANDIN
HEIGHT = 1.77          # matches performer v4.2 (1.768 m)
WIDTH, DEPTH = 0.45, 0.28

def main():
    cname = f'BLOCK_{NAME}'
    if bpy.data.collections.get(cname):
        raise RuntimeError(f'{cname} already exists. Pick a new NAME. Nothing was changed.')
    sc = bpy.context.scene
    coll = bpy.data.collections.new(cname); sc.collection.children.link(coll)

    mover = bpy.data.objects.new(f'BLK_{NAME}_MOVE', None)
    mover.empty_display_type = 'SINGLE_ARROW'; mover.empty_display_size = 0.6
    mover.rotation_mode = 'XYZ'
    coll.objects.link(mover)
    mover['uritp_contract'] = 'origin=floor between feet; front=-Y; up=Z; meters. Animate THIS.'
    mover.location = bpy.context.scene.cursor.location.copy(); mover.location.z = 0.0

    # stand-in: a box with a nose wedge on the front (-Y) so facing reads from any angle
    me = bpy.data.meshes.new(f'BLK_{NAME}_STANDIN')
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * WIDTH, v.co.y * DEPTH, (v.co.z + 0.5) * HEIGHT))
    nose = [bm.verts.new(p) for p in ((-0.08, -DEPTH/2, 1.45), (0.08, -DEPTH/2, 1.45), (0.0, -DEPTH/2, 1.62), (0.0, -DEPTH/2 - 0.14, 1.52))]
    for f in ((0, 1, 3), (1, 2, 3), (2, 0, 3), (0, 2, 1)):
        bm.faces.new([nose[i] for i in f])
    bm.to_mesh(me); bm.free()
    box = bpy.data.objects.new(f'BLK_{NAME}_STANDIN', me)
    coll.objects.link(box)
    box.parent = mover
    box.display_type = 'SOLID'; box.show_wire = True
    box.hide_select = True        # so clicks grab the MOVER, not the box
    box['uritp_role'] = 'stand-in: hide or delete once the real performer is parented to the mover'

    for o in bpy.context.selected_objects: o.select_set(False)
    mover.select_set(True); bpy.context.view_layer.objects.active = mover
    print(f'[ZED BLOCK] made {cname}: animate {mover.name} (G to move, R Z to turn, I to key). Box is unselectable on purpose.')

main()
