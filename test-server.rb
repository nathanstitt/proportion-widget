#!/usr/bin/env ruby

require 'rubygems'
require 'sinatra'
require 'json'

get '/' do
    erb :index
end

