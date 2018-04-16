(ns webbackend.entry
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.fields :refer [field]]))


(defn login-request [global username password]
  (go (let [response (<! (http/post "http://api.festival-jups.ch/login"
                                    {:json-params       {:session ""
                                                         :data    {:username username
                                                                   :password password}}
                                     :with-credentials? false}))
            session (get-in response [:body :data :session])]
        (swap! global
               #(assoc % :session session)))))

(defn login [global]
  (let [state (r/atom
                     {:username nil
                      :password nil})]
    (fn []
      [:div
       [:h2 "festival jups backend"]
       [field "username" :username "Benutzername" state]
       [field "password" :password "Passwort" state]
       [:button {:type "submit"
                 :on-click (fn [e]
                             (.preventDefault e)
                             (login-request
                               global
                               (:username @state)
                               (:password @state)))}
        "weiter"]])))