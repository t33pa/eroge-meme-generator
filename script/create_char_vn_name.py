import json

char_vn_id_path = "./char_vn_id.json"
vn_id_name_path = "./vn_id_name.json"
char_vn_name_dict = {}

with open(char_vn_id_path, "r", encoding="utf-8") as f:
    char_vn_id_dict = json.load(f)

with open(vn_id_name_path, "r", encoding="utf-8") as f:
    vn_id_name_dict = json.load(f)

for char_id, vn_id in char_vn_id_dict.items():
    if vn_id in vn_id_name_dict:
        char_vn_name_dict[char_id] = vn_id_name_dict[vn_id]

with open("char_vn_name.json", "w", encoding="utf-8") as f:
    json.dump(char_vn_name_dict, f, ensure_ascii=False, indent=4)
