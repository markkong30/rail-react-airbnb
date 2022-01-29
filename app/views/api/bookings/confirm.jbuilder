json.booking do
    json.id @booking.id
    json.start_date @booking.start_date
    json.end_date @booking.end_date

    json.property do
        json.id @booking.property.id
        json.title @booking.property.title
        json.max_guests @booking.property.max_guests
        json.bedrooms @booking.property.bedrooms
        json.beds @booking.property.beds 
        json.baths @booking.property.baths
        json.price_per_night @booking.property.price_per_night
      end
end