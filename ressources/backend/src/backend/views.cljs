(ns backend.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [backend.events.views :refer [events-panel]]
    [backend.files.views :refer [files-panel]]
    [backend.login.views :refer [login-panel]]
    [backend.pages.views :refer [pages-panel]]
    [backend.style :as style]))

;; main

(defn header []
  (let [active-panel @(rf/subscribe [:jups.backend.subs/active-panel])]
    [rc/h-box
     :justify :center
     :children (interpose
                 [rc/gap :size (:horizontal-gap style/sizes)]
                 [[rc/hyperlink
                  :label [rc/title
                          :label "Events"
                          :level :level1
                          :underline? (= :events-panel active-panel)]
                  :on-click #(rf/dispatch [:jups.backend/navigate "/events"])]
                 [rc/hyperlink
                  :label [rc/title
                          :label "Pages"
                          :level :level1
                          :underline? (= :pages-panel active-panel)]
                  :on-click #(rf/dispatch [:jups.backend/navigate "/pages"])]
                 [rc/hyperlink
                  :label [rc/title
                          :label "Files"
                          :level :level1
                          :underline? (= :files-panel active-panel)]
                  :on-click #(rf/dispatch [:jups.backend/navigate "/files"])]])]))

(defn- panels [panel-name]
  (case panel-name
    :home-panel [events-panel]
    :events-panel [events-panel]
    :pages-panel [pages-panel]
    :files-panel [files-panel]
    [:div]))

(defn show-panel [panel-name]
  [panels panel-name])

(defn main-panel []
  (let [session @(rf/subscribe [:jups.backend.subs/session])
        active-panel @(rf/subscribe [:jups.backend.subs/active-panel])]
    (if session
      [rc/v-box
       :children [[header]
                  [panels active-panel]]]
      [login-panel])))
