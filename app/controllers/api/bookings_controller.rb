module Api
    class BookingsController < ApplicationController
      def create
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session
  
        property = Property.find_by(id: params[:booking][:property_id])
        return render json: { error: 'cannot find property' }, status: :not_found if !property
  
        begin
          @booking = Booking.create({ user_id: session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date]})
          render 'api/bookings/create', status: :created
        rescue ArgumentError => e
          render json: { error: e.message }, status: :bad_request
        end
      end
  
      def get_property_bookings
        property = Property.find_by(id: params[:id])
        return render json: { error: 'cannot find property' }, status: :not_found if !property
  
        @bookings = property.bookings.where("end_date > ? ", Date.today)
        render 'api/bookings/index'
      end
  
      def property_booking
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session

        @booking = session.user.bookings.find_by(id: params[:id])
        return render json: { error: 'no access right' }, status: :unauthorized if !@booking
        
        render 'api/bookings/confirm'
      end

      def get_bookings_as_guest
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session

        user = session.user
        @bookings = user.bookings.where("end_date > ? ", Date.today)
        return render json: { error: 'cannot find booking' }, status: :not_found if !@bookings

        render 'api/bookings/guest'
      end

      # def get_bookings_as_host
      #   token = cookies.signed[:airbnb_session_token]
      #   session = Session.find_by(token: token)
      #   return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      #   user = session.user
      #   property_id = user.properties.id
      #   bookings = Booking.where(property_id.include(property_id))
      #   @bookings = bookings.where("end_date > ? ", Date.today)
      #   return render json: { error: 'cannot find booking' }, status: :not_found if !@bookings

      #   render 'api/bookings/guest'
      # end



      private
  
      def booking_params
        params.require(:booking).permit(:property_id, :start_date, :end_date)
      end
    end
  end