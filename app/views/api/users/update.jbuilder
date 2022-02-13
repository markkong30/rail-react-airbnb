json.user do 
    json.username @user.username
    json.email @user.email
    json.password @user.password
    json.image url_for(@user.image) if @user.image.attached?
end