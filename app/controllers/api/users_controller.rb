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

      if @user.update(user_params)
        render 'api/users/update', status: :ok
      else
        render json: { success: false}, status: :bad_request
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username, :image)
    end
  end
end