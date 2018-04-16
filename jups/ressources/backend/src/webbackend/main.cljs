(ns webbackend.main
  (:require
    [reagent.core :as r]
    [webbackend.events :refer [events-form event-list]]
    [webbackend.entry :refer [login]]))

(defonce global (r/atom {:page login}
                     :session nil
                     :event {:ausverkauft false}))

(defn main []
  [:div
   (cond (not
           (nil?
             (:session @global)))
         [events-form global]
         :default
         [login global])])
