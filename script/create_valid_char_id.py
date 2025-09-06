filter_vn_path = "./filter_vn.json"
char_vn_path = "./db/chars_vns"
filter_vn_list = []
char_vn_list = []
valid_char_set = set()

with open(filter_vn_path, "r", encoding="utf-8") as f:
    filter_vn_list = eval(f.read())

with open(char_vn_path, "r") as f:
    char_vn_list = f.readlines()

char_vn_list = [row.strip() for row in char_vn_list]

for row in char_vn_list:
    splited_row = row.split("\t")
    char_id = splited_row[0]
    vn_id = splited_row[1]
    char_type = splited_row[3]

    if not vn_id in filter_vn_list and char_type != "appears":
        valid_char_set.add(char_id)

valid_char_list = list(valid_char_set)

with open("valid_char_id.json", "w", encoding="utf-8") as f:
    f.write(str(valid_char_list))

print("Done")
