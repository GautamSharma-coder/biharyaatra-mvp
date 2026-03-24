import os
import re

app_dir = r"c:/Users/asus/Code_folder/Project_code/biharyaatra-main/Biharyaatra/bihar-yaatra/app/public"

for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.endswith(".tsx"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            original_content = content
            
            # Replace header z-50 with z-[999]
            content = content.replace(
                '<header className={`fixed w-full top-0 z-50 transition-all',
                '<header className={`fixed w-full top-0 z-[999] transition-all'
            )
            
            # Replace mobile menu z-50 with z-[1000]
            content = content.replace(
                '<div className="fixed inset-0 z-50 flex justify-end">',
                '<div className="fixed inset-0 z-[1000] flex justify-end">'
            )
            
            # Replace gap issue
            # Using basic replace since we know the exact strings
            old_dropdown_start = '<div className="absolute left-1/2 -translate-x-1/2 mt-4 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 transform origin-top">'
            new_dropdown_start = '<div className="absolute left-1/2 -translate-x-1/2 pt-4 w-56 transform origin-top animate-fade-in-down z-50">\n                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">'
            content = content.replace(old_dropdown_start, new_dropdown_start)
            
            # To fix the unclosed tag, we need to find "Expert Guides</Link>\n                                    </div>" and replace with "Expert Guides</Link>\n                                        </div>\n                                    </div>"
            old_dropdown_end = 'Expert Guides</Link>\n                                    </div>'
            new_dropdown_end = 'Expert Guides</Link>\n                                        </div>\n                                    </div>'
            
            content = content.replace(old_dropdown_end, new_dropdown_end)

            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Updated {filepath}")
