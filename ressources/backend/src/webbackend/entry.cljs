(ns webbackend.entry
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.fields :refer [field]]))


(defn login-request [global]
  (go (let [response (<! (http/post "http://api.festival-jups.ch/login"
                                    {:json-params       {:session ""
                                                         :data    {:username (:username @global)
                                                                   :password (:password @global)}}
                                     :with-credentials? false}))
            error (get-in response [:body :error])
            session (get-in response [:body :data :session])]
        (if (or (nil? error)
                (true? (:error error)))
          (swap! global
                 #(assoc % :error (:message error)))
          (swap! global
                 #(assoc % :session session))))))

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