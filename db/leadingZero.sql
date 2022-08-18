//without as phone, select query will be empty and erro
update user set phone=LPAD(phone,10,'0') as phone;
update user_profile set parent_contact=LPAD(parent_contact,10,'0');
update user_profile set school_contact=LPAD(school_contact,10,'0');
update user_profile set teacher_contact=LPAD(teacher_contact,10,'0');
