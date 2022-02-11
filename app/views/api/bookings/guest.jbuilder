json.bookings do
    json.array! @bookings do |booking|
        json.property_title booking.property.title
        json.id booking.id
        json.start_date booking.start_date
        json.end_date booking.end_date
        json.paid booking.is_paid?
        json.image_url booking.property.image_url
        json.image url_for(booking.property.image) if booking.property.image.attached?  
    end   
end
