import json

title_file = "./db/vn_titles"

title_rows = []
id_name_dict = {}

with open(title_file, "r", encoding="utf-8") as f:
    title_rows = f.readlines()

title_rows = [title_row.strip() for title_row in title_rows]

for title_row in title_rows:
    columns = title_row.split("\t")
    title_id = columns[0]
    title_name = columns[3]
    title_name = title_name.replace("　", "")
    id_name_dict[title_id] = title_name

with open("vn_id_name.json", "w", encoding="utf-8") as f:
    json.dump(id_name_dict, f, ensure_ascii=False, indent=4)
