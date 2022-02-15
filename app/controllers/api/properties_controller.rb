module Api
    class PropertiesController < ApplicationController
      def index
        @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
        return render json: { error: 'not_found' }, status: :not_found if !@properties
  
        render 'api/properties/index', status: :ok
      end

      def get_properties_by_search
        @properties = Property.where("lower(city) like ? OR lower(country) like ?", "%#{params[:city].downcase}%", "%#{params[:country].downcase}%").order(created_at: :desc).page(params[:page]).per(6)
        return render json: { error: 'not_found' }, status: :not_found if !@properties

        render 'api/properties/index', status: :ok
      end 

      def get_properties_by_filter
        @properties = Property.where("lower(property_type) like ?", "%#{params[:type].downcase}%").page(params[:page]).order(created_at: :desc).per(6)
        return render json: { error: 'not_found' }, status: :not_found if !@properties

        render 'api/properties/index', status: :ok
      end

      def get_properties_by_search_and_filter
        properties = Property.where("lower(city) like ? OR lower(country) like ?", "%#{params[:city].downcase}%", "%#{params[:country].downcase}%")

        @properties = properties.where("lower(property_type) like ?", "%#{params[:type].downcase}%").order(created_at: :desc).page(params[:page]).per(6)

        return render json: { error: 'not_found' }, status: :not_found if !@properties

        render 'api/properties/index', status: :ok
      end

  
      def show
        @property = Property.find_by(id: params[:id])
        return render json: { error: 'not_found' }, status: :not_found if !@property
  
        render 'api/properties/show', status: :ok
      end

      def list
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session

        user = session.user
        @properties = user.properties
        return render 'api/properties/list', status: :ok
      end

      def update
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session

        user = session.user
        @property = user.properties.find_by(id: params[:id])
        return render json: { error: 'not_found' }, status: :not_found if !@property

        @property.update(property_params)
        return render 'api/properties/show'
      end

      def create
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session

        begin
          @property = session.user.properties.new(property_params)
          if @property.save
            render 'api/properties/create', status: :created
          end
        rescue ArgumentError => e
          render json: { error: e.message }, status: :bad_request   
        end
      end

      private

      def property_params
        params.require(:property).permit(:title, :description, :city, :country, :property_type, :price_per_night, :max_guests, :bedrooms, :beds, :baths, :image_url, :image)
      end
  end
end