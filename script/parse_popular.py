import json

vn_file = "./db/vn"
vn_list = []
vn_vote_dict = {}

with open(vn_file, "r", encoding="utf-8") as f:
    vn_list = f.readlines()

vn_list = [vn.strip() for vn in vn_list]

for vn in vn_list:
    columns = vn.split("\t")
    vn_id = columns[0]
    try:
        vn_vote = int(columns[5])
    except ValueError:
        continue

    vn_vote_dict[vn_id] = vn_vote

with open("vn_vote.json", "w", encoding="utf-8") as f:
    json.dump(vn_vote_dict, f, ensure_ascii=False, indent=4)
