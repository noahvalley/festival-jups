(ns backend.events.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [goog.date.UtcDateTime :as time]
    [backend.style :as style]))

;; ----------------------------------------------
;; helper functions

(defn compare-events [a b]
  (let [dateA (or (first (clojure.string/split (:zeitVon a) "T")) "0")
        dateB (or (first (clojure.string/split (:zeitVon b) "T")) "0")]
    (cond
      (< dateA dateB) -1
      (> dateA dateB) 1
      (> (:priority a) (:priority b)) 1
      (< (:priority a) (:priority b)) -1
      :default 0)))

;; -----------------------------------------------
;; input elements

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

(defn event-text-field [kw label]
  [label-and-input
   label
   [text-field
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn dropdown [choices model-atom dispatch-fn]
  [rc/single-dropdown
   :choices choices
   :model @model-atom
   :on-change dispatch-fn
   :width (:input-field-width style/sizes)])

(defn event-dropdown [kw label choices]
  [label-and-input
   label
   [dropdown
    choices
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn checkbox [model-atom dispatch-fn]
  [rc/checkbox
   :model @model-atom
   :on-change dispatch-fn])

(defn event-checkbox [kw label]
  [label-and-input
   label
   [checkbox
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn date [kw label]
  [label-and-input
   label
   [rc/h-box
    :children [[rc/datepicker-dropdown
                :model (let [iso-date @(rf/subscribe [:jups.backend.subs/active-event-field kw])]
                         (if iso-date (time/fromIsoString iso-date)))
                :on-change #(rf/dispatch [:jups.backend.events/change-event-date
                                          kw
                                          (.getFullYear %)
                                          (.getMonth %)
                                          (.getDate %)])]
               [rc/gap :size (:horizontal-gap style/sizes)]
               [rc/input-time
                :model (or @(rf/subscribe [:jups.backend.subs/active-event-time kw]) 0)
                :on-change #(rf/dispatch [:jups.backend.events/change-event-time kw %])
                :show-icon? true]]]])

(defn number-field [model-atom dispatch-fn]
  [:input {:class     "form-control"
           :type      "number"
           :name      ""
           :value     @model-atom
           :on-change dispatch-fn}])

(defn event-number-field [kw label]
  [label-and-input
   label
   [number-field
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw (-> % .-target .-value)])]])

(defn image-from-url [url]
  [rc/v-box
   :align-self :center
   :max-width (:dropdown-picture-size style/sizes)
   :max-height (:dropdown-picture-size style/sizes)
   :children [[rc/gap :size (:vertical-gap style/sizes)]
              [:img {:src url}]]])

(defn double-dropdown [kw label list-kw]
  [label-and-input
   label
   [rc/v-box
    :width (:input-field-width style/sizes)
    :children [[rc/h-box
                :width (:input-field-width style/sizes)
                :children [[rc/single-dropdown
                            :choices @(rf/subscribe [:jups.backend.subs/years-dropdown list-kw])
                            :model @(rf/subscribe [:jups.backend.subs/active-event-image-year kw])
                            :on-change #(rf/dispatch [:jups.backend.events/select-years-dropdown kw %])]
                           [rc/gap :size (:horizontal-gap style/sizes)]
                           [rc/single-dropdown
                            :choices @(rf/subscribe [:jups.backend.subs/files-dropdown
                                                     list-kw
                                                     @(rf/subscribe [:jups.backend.subs/active-event-image-year kw])])
                            :model @(rf/subscribe [:jups.backend.subs/active-event-image-file kw])
                            :on-change #(rf/dispatch [:jups.backend.events/select-files-dropdown kw %])]]]
               (let [url @(rf/subscribe [:jups.backend.subs/active-event-field kw])]
                 (if (= 2 (count (clojure.string/split url "/")))
                   [image-from-url (str "http://api.festival-jups.ch/" (name list-kw) "/" url)]))]]])

;; -----------------------------------------------
;; event form layout

(defn events-sidebar []
  (let [events @(rf/subscribe [:jups.backend.subs/events])
        changed-events @(rf/subscribe [:jups.backend.subs/changed-events])]
    [rc/v-box
     :children (for [event (sort compare-events events)]
                 ^{:key (:id event)}
                 [rc/h-box
                  :align :center
                  :children (interpose
                              [rc/gap :size (:horizontal-gap style/sizes)]
                              [[rc/label
                                :style {:font-size "10px"}
                                :label (if (:zeitVon event)
                                         (-> (:zeitVon event)
                                             (clojure.string/replace #"T..:.." "")
                                             (clojure.string/replace #"-" "/")
                                             (->> (drop 2))))]
                               [rc/label
                                :label (case (:type event)
                                         "workshop" "W"
                                         "veranstaltung" "V"
                                         "offenesangebot" "A"
                                         " ")]
                               [rc/hyperlink
                                :style (let [changed-event @(rf/subscribe [:jups.backend.subs/changed-event (:id event)])]
                                         {:color (if (or (= event changed-event)
                                                         (nil? changed-event))
                                                   "black"
                                                   "darkred")})
                                :label (if (or (nil? (:titel event))
                                               (= "" (:titel event)))
                                         "OHNE TITEL"
                                         (:titel event))
                                :on-click #(rf/dispatch [:jups.backend.events/active-event (:id event)])]])])]))

(defn event-form []
  [rc/v-box
   :children (interpose
               [rc/gap :size (:vertical-gap style/sizes)]
               [(if (nil? @(rf/subscribe [:jups.backend.subs/active-event-field :id]))
                  [label-and-input ""
                   [rc/label
                    :style {:color "darkred"}
                    :label "Neuer Event: nicht gespeichert"]])
                [event-text-field :titel "Titel"]
                [event-text-field :untertitel "Untertitel"]
                [event-dropdown
                 :type
                 "Typ"
                 [{:id "workshop" :label "Workshop"}
                  {:id "veranstaltung" :label "Veranstaltung"}
                  {:id "offenesangebot" :label "Offenes Angebot"}]]
                [event-text-field :ort "Ort"]
                [date :zeitVon "Beginn"]
                [date :zeitBis "Ende"]
                [event-number-field :priority "Priorität"]
                [double-dropdown :bild "Bild" :images]
                [double-dropdown :logo "Logo" :images]
                ;[prosemirror :text @event]
                [event-checkbox :ausverkauft "Ausverkauft"]
                [event-text-field :ausverkauftText "Ausverkauft"]
                [event-text-field :abAlter "Mindestalter"]
                [event-text-field :tuerOeffnung "Türöffnung"]
                [event-text-field :preis "Preis"]
                ;[field rc/input-textarea :text "Beschreibung"]
                ])])

(defn events-buttons []
  (let [active-event-id @(rf/subscribe [:jups.backend.subs/active-event-id])]
    [rc/h-box
     :justify :center
     :children (interpose
                 [rc/gap :size (:vertical-gap style/sizes)]
                 [[rc/button
                   :label "Event speichern"
                   :on-click #(if (nil? active-event-id)
                                (rf/dispatch [:jups.backend.events/->create-event active-event-id])
                                (rf/dispatch [:jups.backend.events/->update-event active-event-id]))]
                  [rc/button
                   :label "Änderungen an Event verwerfen"
                   :on-click #(rf/dispatch [:jups.backend.events/event-discard-changes active-event-id])]
                  [rc/button
                   :label "Event löschen"
                   :on-click #(rf/dispatch [:jups.backend.events/->delete-event active-event-id])]
                  [rc/button
                   :label "Neuer Event"
                   :on-click #(rf/dispatch [:jups.backend.events/new-event active-event-id])]])]))

(defn events-panel []
  [rc/v-box
   :children [[rc/v-box
               :children [[events-buttons]
                          [rc/gap :size (:vertical-gap style/sizes)]
                          [rc/h-box
                           :children (interleave
                                       (repeat [rc/gap :size (:horizontal-gap style/sizes)])
                                       [[rc/box :size (:sidebar-width style/sizes) :child [events-sidebar]]
                                        [rc/box :size "1" :child [event-form]]])]]]]])