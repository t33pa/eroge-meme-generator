import json
import datetime

title_file = "./db/vn_titles"
filter_vn = "./filter_vn.json"
id_image_dict_path = "./vn_image.json"
id_vote_dict_path = "./vn_vote.json"
id_image_dict = {}
title_list = []
filter_image_list = []
vote_list = []
id_image_dict = {}
title_image_dict = {}

with open(title_file, "r", encoding="utf-8") as f:
    title_list = f.readlines()

with open(filter_vn, "r", encoding="utf-8") as f:
    filter_vn_list = eval(f.read())

with open(id_image_dict_path, "r", encoding="utf-8") as f:
    id_image_dict = json.load(f)

with open(id_vote_dict_path, "r", encoding="utf-8") as f:
    vote_list = json.load(f)

title_list = [title.strip() for title in title_list]
id_title_dict = {}

for title in title_list:
    columns = title.split("\t")
    title_id = columns[0]
    title_lang = columns[1]
    is_official = columns[2]
    title_name = columns[3]
    title_name = title_name.replace("　", "")

    if title_lang == "ja" and is_official == "t" and title_id not in filter_vn_list:
        id_title_dict[title_id] = title_name
        # title_image_dict[title_name] = id_image_dict[title_id]

# Sort by vote count
id_title_dict = dict(
    sorted(
        id_title_dict.items(), key=lambda item: vote_list.get(item[0], 0), reverse=True
    )
)

print(len(id_title_dict))

for vn_id in id_title_dict:
    image_id = id_image_dict.get(vn_id, "\\N")
    if image_id == "\\N":
        continue
    title_image_dict[id_title_dict[vn_id]] = image_id

print("Number of titles: ", len(id_title_dict))

with open("../src/app/data/title_image.json", "w", encoding="utf-8") as f:
    json.dump(title_image_dict, f, ensure_ascii=False, indent=None)

now = datetime.datetime.now()
yyyymmdd = now.strftime("%Y/%m/%d")
content = {"lastUpdate": f"最終更新日: {yyyymmdd}"}

with open("../src/app/dictionaries/lastUpdate.json", "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=4)
