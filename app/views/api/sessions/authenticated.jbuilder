json.authenticated true
json.username @user.username
json.user_id @user.id
json.email @user.email
json.password @user.password
json.image url_for(@user.image) if @user.image.attached?