json.properties do
    json.array! @properties do |property|
      json.id property.id
      json.title property.title
      json.city property.city
      json.country property.country
      json.property_type property.property_type
      json.price_per_night property.price_per_night
      json.image_url property.image_url
      json.image url_for(property.image) if property.image.attached?


      json.bookings do
        json.array! property.bookings do |booking|
          json.booking_id booking.id
          json.start_date booking.start_date
          json.end_date booking.end_date 
          json.username booking.user.username
          json.property_title booking.property.title
          json.property_id booking.property.id
          json.image_url booking.property.image_url
          json.image url_for(booking.property.image) if booking.property.image.attached?

          json.charges do
              json.array! booking.charges do |charge|
                 json.amount charge.amount 
                json.complete charge.complete
           
          end
        end
      end
      
      end

    end
  end