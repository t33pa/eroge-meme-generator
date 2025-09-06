import json

vn_file = "./db/vn"
vn_list = []
vn_image_dict = {}

with open(vn_file, "r", encoding="utf-8") as f:
    vn_list = f.readlines()

vn_list = [vn.strip() for vn in vn_list]

for vn in vn_list:
    columns = vn.split("\t")
    vn_id = columns[0]
    vn_image = columns[2]

    vn_image_dict[vn_id] = vn_image

with open("vn_image.json", "w", encoding="utf-8") as f:
    json.dump(vn_image_dict, f, ensure_ascii=False, indent=4)
