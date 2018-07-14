(ns backend.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [backend.events.views :refer [events-panel]]
    [backend.files.views :refer [files-panel]]
    [backend.login.views :refer [login-panel]]
    [backend.pages.views :refer [pages-panel]]
    [backend.style :as style]))

;; ------------------------------------------------------
;; navigation

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

;; --------------------------------------------------------
;; common components

(defn label-and-input [label input-field]
  [rc/h-box
   :children [[rc/h-box
               :children [[rc/label
                           :label label
                           :style {:align-self "center"}]
                          [rc/gap :size (:horizontal-gap style/sizes)]]
               :width (:input-label-width style/sizes)
               :style {:justify-content "flex-end"}]
              input-field]])

(defn text-field [model-atom dispatch-fn]
  [rc/input-text
   :model (or @model-atom "")
   :on-change dispatch-fn
   :width (:input-field-width style/sizes)])

(defn dropdown [choices model-atom dispatch-fn]
  [rc/single-dropdown
   :choices choices
   :model @model-atom
   :on-change dispatch-fn
   :width (:input-field-width style/sizes)])

(defn double-dropdown [{:keys [upper-choices-atom
                               upper-choice-atom
                               upper-dispatch-fn
                               lower-choices-atom
                               lower-choice-atom
                               lower-dispatch-fn]}]
  [rc/h-box
   :width (:input-field-width style/sizes)
   :children [[rc/single-dropdown
               :choices @upper-choices-atom
               :model @upper-choice-atom
               :on-change upper-dispatch-fn]
              [rc/gap :size (:horizontal-gap style/sizes)]
              [rc/single-dropdown
               :choices @lower-choices-atom
               :model @lower-choice-atom
               :on-change lower-dispatch-fn]]])

(defn checkbox [model-atom dispatch-fn]
  [rc/checkbox
   :model @model-atom
   :on-change dispatch-fn])

(defn number-field [model-atom dispatch-fn]
  [:input {:class     "form-control"
           :type      "number"
           :name      ""
           :value     @model-atom
           :on-change dispatch-fn}])

(defn panel [{:keys [buttons sidebar form]}]
  [rc/v-box
   :children [[rc/v-box
               :children [[buttons]
                          [rc/gap :size (:vertical-gap style/sizes)]
                          [rc/h-box
                           :children (interleave
                                       (repeat [rc/gap :size (:horizontal-gap style/sizes)])
                                       [[rc/box :size (:sidebar-width style/sizes) :child [sidebar]]
                                        [rc/box :size "1" :child [form]]])]]]]])