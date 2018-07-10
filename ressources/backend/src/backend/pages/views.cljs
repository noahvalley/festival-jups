(ns backend.pages.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [backend.style :as style]))

(defn pages-sidebar []
  (let [pages @(rf/subscribe [:jups.backend.subs/pages])]
    [:ul
     [:li
      [rc/hyperlink
       :label "OHNE TITEL"]]]))

(defn pages-form []
  [:div])

(defn pages-panel []
  [rc/v-box
   :children [[rc/h-box
               :children [[rc/box :size (:sidebar-width style/sizes) :child [pages-sidebar]]
                          [rc/box :size "1" :child [pages-form]]]]]])