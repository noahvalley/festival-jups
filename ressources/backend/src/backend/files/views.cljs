(ns backend.files.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [backend.style :as style]))

(defn files-sidebar []
  (let [pages @(rf/subscribe [:jups.backend.subs/pages])]
    [:ul
     [:li
      [rc/hyperlink
       :label "OHNE TITEL"]]]))

(defn files-form []
  [:div])

(defn files-panel []
  [rc/v-box
   :children [[rc/h-box
               :children [[rc/box :size (:sidebar-width style/sizes) :child [files-sidebar]]
                          [rc/box :size "1" :child [files-form]]]]]])