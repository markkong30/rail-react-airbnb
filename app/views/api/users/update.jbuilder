json.user do 
    json.username @user.username
    json.email @user.email
    json.image url_for(@user.image) if @user.image.attached?
end