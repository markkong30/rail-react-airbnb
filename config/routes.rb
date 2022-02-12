Rails.application.routes.draw do
  root to: 'static_pages#index'
  get '/home' => 'static_pages#home'
  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/booking/:id/success' => 'static_pages#success'
  get '/user/:id' => 'static_pages#user'
  get '/user/:id/host' => 'static_pages#user'


  namespace :api do
    # Add routes below this line

    #properties
    get '/properties/user' => 'properties#list'
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'

    #bookings
    get '/booking/guest' => 'bookings#get_bookings_as_guest'
    get '/booking/:id' => 'bookings#property_booking'

    #charges
    post '/charges/mark_complete' => 'charges#mark_complete'

    #users
    put '/users/update' => 'users#update'

    #sessions
    get '/authenticated' => 'sessions#authenticated'
    delete '/logout' => 'sessions#destroy'


    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]
    resources :properties, only: [:index, :show, :update, :create]
    resources :bookings, only: [:create]
    resources :charges, only: [:create]
  end

end
