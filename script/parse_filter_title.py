import json

vn_file = "./db/vn"
vn_list = []
filter_vn_list = []

with open(vn_file, "r", encoding="utf-8") as f:
    vn_list = f.readlines()

vn_list = [vn.strip() for vn in vn_list]

for vn in vn_list:
    columns = vn.split("\t")
    vn_id = columns[0]
    vn_votecount = columns[5]
    try:
        if int(vn_votecount) < 5:
            filter_vn_list.append(vn_id)
    except ValueError:
        continue

with open("filter_vn.json", "w", encoding="utf-8") as f:
    json.dump(filter_vn_list, f, ensure_ascii=False, indent=0)
