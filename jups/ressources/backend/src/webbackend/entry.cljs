(ns webbackend.entry
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]))

(defn login []
  (let [form-state (r/atom
                     {:username nil
                      :password nil})]
    (fn []
      [:div
       [:p (:username @form-state)]
       [:p (:password @form-state)]
       [:h2 "festival jups backend"]
       [:form
        [:div
         [:label {:for "username"} "Benutzername: "]
         [:input {:type      "text"
                  :name      "username"
                  :on-change (fn [e]
                               (swap!
                                 form-state
                                 #(assoc
                                    %
                                    :username
                                    (-> e .-target .-value))))}]]
        [:div
         [:label {:for "password"} "Passwort: "]
         [:input {:type "password"
                  :name "password"
                  :on-change (fn [e]
                               (swap!
                                 form-state
                                 #(assoc
                                    %
                                    :password
                                    (-> e .-target .-value))))}]]
        [:button {:type "submit"
                  :on-click (fn [e]
                              (.preventDefault e))}
         "submit"]]])))