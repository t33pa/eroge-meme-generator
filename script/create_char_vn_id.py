import json

chars_vns_path = "./db/chars_vns"
char_vn_id_dict = {}

with open(chars_vns_path, "r", encoding="utf-8") as f:
    char_vn_list = f.readlines()

char_vn_list = [row.strip() for row in char_vn_list]

for row in char_vn_list:
    splited_row = row.split("\t")
    char_id = splited_row[0]
    vn_id = splited_row[1]
    char_vn_id_dict[char_id] = vn_id

with open("char_vn_id.json", "w", encoding="utf-8") as f:
    json.dump(char_vn_id_dict, f, ensure_ascii=False, indent=4)
