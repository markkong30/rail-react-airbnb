Rails.application.routes.draw do
  root to: 'static_pages#home'
  # get '/' => 'static_pages#home'
  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/booking/:id/success' => 'static_pages#success'
  get '/user/:id' => 'static_pages#user'
  get '/user/:id/host' => 'static_pages#user'


  namespace :api do
    # Add routes below this line
    get '/properties/user' => 'properties#list'
    post '/properties/create' => 'properties#create'
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'

    get '/authenticated' => 'sessions#authenticated'
    delete '/logout' => 'sessions#destroy'
    get '/booking/:id' => 'bookings#property_booking'

    post '/charges/mark_complete' => 'charges#mark_complete'
  
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]
    resources :properties, only: [:index, :show, :update]
    resources :bookings, only: [:create]
    resources :charges, only: [:create]
  end

end
