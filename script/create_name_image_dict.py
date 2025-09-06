import json

valid_char_list_path = "./valid_char_id.json"
char_list_path = "./db/chars"
char_vn_name_path = "./char_vn_name.json"
valid_char_set = set()
name_image_dict = {}
vn_id_name_dict = {}


def contains_hangul(text):
    for char in text:
        if (
            "\u1100" <= char <= "\u11ff"
            or "\u3130" <= char <= "\u318f"
            or "\uac00" <= char <= "\ud7af"
        ):
            return True
    return False


def contains_simplified_chinese(text):
    for char in text:
        if "\u4e00" <= char <= "\u9fff":
            return True
    return False


with open(valid_char_list_path, "r", encoding="utf-8") as f:
    valid_char_set = set(eval(f.read()))

with open(char_list_path, "r", encoding="utf-8") as f:
    char_list = f.readlines()

with open(char_vn_name_path, "r", encoding="utf-8") as f:
    char_vn_name_dict = json.load(f)

char_list = [row.strip() for row in char_list]
appeared_char_name_set = set()

for row in char_list:
    splited_row = row.split("\t")
    char_id = splited_row[0]
    image_id = splited_row[1]
    char_name = splited_row[17]
    try:
        vn = char_vn_name_dict[char_id]
    except KeyError:
        print(f"KeyError: {char_id}")
        continue
    char_name = char_name.replace("　", "")
    char_name = char_name.replace(" ", "")
    if char_name in appeared_char_name_set:
        char_name = "{} ({})".format(char_name, vn)
    if (
        char_id in valid_char_set
        and image_id != "\\N"
        and not contains_hangul(char_name)
    ):
        name_image_dict[char_name] = image_id
        appeared_char_name_set.add(char_name)

with open("char_image.json", "w", encoding="utf-8") as f:
    json.dump(name_image_dict, f, ensure_ascii=False, indent=None)

print("Done")
