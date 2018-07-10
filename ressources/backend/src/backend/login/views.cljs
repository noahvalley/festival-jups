(ns backend.login.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]))

(defn login-panel []
  [rc/v-box
   :align :center
   :children [[rc/title
               :label "jups backend login"
               :level :level1]
              [rc/input-text
               :model ""
               :on-change #(rf/dispatch [:jups.backend.events/change-username %])
               :placeholder "Benutzername"]
              [rc/input-password
               :model ""
               :on-change #(rf/dispatch [:jups.backend.events/change-password %])
               :placeholder "Passwort"]
              [rc/button
               :label "login"
               :on-click #(rf/dispatch [:jups.backend.events/->login])]]])