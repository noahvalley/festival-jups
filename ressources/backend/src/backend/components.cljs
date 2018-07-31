(ns backend.components
  (:require [re-com.core :as rc]
            [backend.style :as style]))

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

(defn textarea-field [model-atom dispatch-fn rows]
  [rc/input-textarea
   :rows rows
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

(defn image-from-url [url]
  [rc/v-box
   :align-self :center
   :max-width (:dropdown-picture-size style/sizes)
   :max-height (:dropdown-picture-size style/sizes)
   :children [[rc/gap :size (:vertical-gap style/sizes)]
              [:img {:src url}]]])

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