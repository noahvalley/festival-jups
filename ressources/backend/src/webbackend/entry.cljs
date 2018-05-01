(ns webbackend.entry
  (:require
    [webbackend.fields :refer [field]]
    [webbackend.requests :refer [login-request]]))

(defn login [global]
  (fn []
    [:div
     [:h2 "festival jups backend"]
     [:form
      [field "username" :username "Benutzername" global]
      [field "password" :password "Passwort" global]
      [:button {:type     "submit"
                :on-click (fn [e]
                            (.preventDefault e)
                            (login-request global))}
       "weiter"]
      [:p (:error @global)]]]))