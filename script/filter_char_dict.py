import json

char_image_path = "./char_image.json"
char_image_dict = {}
new_char_image_dict = {}

with open(char_image_path, "r", encoding="utf-8") as f:
    char_image_dict = json.load(f)

for char_name, image_id in char_image_dict.items():
    if char_name.isdigit():
        continue

    char_digit = int(image_id.replace("ch", ""))
    if char_digit >= 71335 and char_digit <= 71355:
        continue
    if char_digit >= 71562 and char_digit <= 71602:
        continue
    if char_digit >= 711964 and char_digit <= 72002:
        continue

    new_char_image_dict[char_name] = image_id

with open("../src/app/data/char_image.json", "w", encoding="utf-8") as f:
    json.dump(new_char_image_dict, f, ensure_ascii=False, indent=None)

print("Charracter count: ", len(new_char_image_dict))
