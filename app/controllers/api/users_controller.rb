module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        render 'api/users/create', status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end
    
    def update 
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      @user = session.user
      @user.update(user_params)
      return render 'api/users/update'
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username, :image)
    end
  end
end