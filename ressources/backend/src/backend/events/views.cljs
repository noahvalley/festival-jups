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

(defn input [label input-field]
  [rc/h-box
   :children [[rc/h-box
               :children [[rc/label
                           :label label
                           :style {:align-self "center"}]
                          [rc/gap :size (:input-label-gap style/sizes)]]
               :width (:input-label-width style/sizes)
               :style {:justify-content "flex-end"}]
              input-field]])

(defn field [type kw label]
  [input
   label
   [type
    :model (or @(rf/subscribe [:jups.backend.subs/active-event-field kw]) "")
    :on-change #(rf/dispatch [:jups.backend.events/change-event kw %])
    :width (:input-field-width style/sizes)]])

(defn dropdown [kw label choices]
  [input
   label
   [rc/single-dropdown
    :choices choices
    :model @(rf/subscribe [:jups.backend.subs/active-event-field kw])
    :on-change #(rf/dispatch [:jups.backend.events/change-event kw %])
    :width (:input-field-width style/sizes)]])

(defn checkbox [kw label]
  [input
   label
   [rc/checkbox
    :model @(rf/subscribe [:jups.backend.subs/active-event-field kw])
    :on-change #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn date [kw label]
  [input
   label
   [rc/h-box
    :children [[rc/datepicker-dropdown
                :model (let [iso-date @(rf/subscribe [:jups.backend.subs/active-event-field kw])]
                         (if iso-date (time/fromIsoString iso-date)))
                :on-change #(rf/dispatch [:jups.backend.events/change-event-date kw (str
                                                                                      (.getFullYear %)
                                                                                      "-"
                                                                                      (let [month (+ 1 (.getMonth %))]
                                                                                        (if (< month 10)
                                                                                          (str "0" month)
                                                                                          month))
                                                                                      "-"
                                                                                      (let [day-of-month (.getDate %)]
                                                                                        (if (< day-of-month 10)
                                                                                          (str "0" day-of-month)
                                                                                          day-of-month)))])]
               [rc/gap :size (:input-field-gap style/sizes)]
               [rc/input-time
                :model (or @(rf/subscribe [:jups.backend.subs/active-event-time kw]) 0)
                :on-change #(rf/dispatch [:jups.backend.events/change-event-time kw %])
                :show-icon? true]]]])

(defn number-field [kw label]
  [input
   label
   [:input {:class "form-control"
            :type      "number"
            :name      (str kw)
            :value     @(rf/subscribe [:jups.backend.subs/active-event-field kw])
            :on-change #(rf/dispatch [:jups.backend.events/change-event kw (-> % .-target .-value)])}]
   [rc/checkbox
    :model @(rf/subscribe [:jups.backend.subs/active-event-field kw])
    :on-change #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn image-from-url [url]
  [rc/v-box
   :align-self :center
   :max-width "200px"
   :max-height "200px"
   :children [[rc/gap :size (:between-input-fields-gap style/sizes)]
              [:img
               {:src url}]]])

(defn double-dropdown [kw label list-kw]
  [input
   label
   [rc/v-box
    :width (:input-field-width style/sizes)
    :children [[rc/h-box
                :width (:input-field-width style/sizes)
                :children [[rc/single-dropdown
                            :choices @(rf/subscribe [:jups.backend.subs/years-dropdown list-kw])
                            :model @(rf/subscribe [:jups.backend.subs/event-image-year kw])
                            :on-change #(rf/dispatch [:jups.backend.events/select-years-dropdown kw %])]
                           [rc/single-dropdown
                            :choices @(rf/subscribe [:jups.backend.subs/files-dropdown
                                                     list-kw
                                                     @(rf/subscribe [:jups.backend.subs/event-image-year kw])])
                            :model @(rf/subscribe [:jups.backend.subs/event-image-file kw])
                            :on-change #(rf/dispatch [:jups.backend.events/select-files-dropdown kw %])]]]
               (let [url @(rf/subscribe [:jups.backend.subs/active-event-field kw])]
                 (if (= 2 (count (clojure.string/split url "/")))
                   [image-from-url (str "http://api.festival-jups.ch/" (name list-kw) "/" url)]))]]])

;; -----------------------------------------------
;; event form layout

(defn events-sidebar []
  (let [events @(rf/subscribe [:jups.backend.subs/events])]
    [:ul (for [list-event (sort compare-events events)]
           ^{:key (:id list-event)}
           [:li
            [rc/hyperlink
             :label (or (:titel list-event) "OHNE TITEL")
             :on-click #(rf/dispatch [:jups.backend.events/active-event (:id list-event)])]])]))

(defn event-form []
  [rc/v-box
   :children (interpose
               [rc/gap :size (:between-input-fields-gap style/sizes)]
               [[field rc/input-text :titel "Titel"]
               [field rc/input-text :untertitel "Untertitel"]
               [dropdown
                :type
                "Typ"
                [{:id "workshop" :label "Workshop"}
                 {:id "veranstaltung" :label "Veranstaltung"}
                 {:id "offenesangebot" :label "Offenes Angebot"}]]
               [field rc/input-text :ort "Ort"]
               [date :zeitVon "Beginn"]
               [date :zeitBis "Ende"]
               [number-field :priority "Priorität"]
               [double-dropdown :bild "Bild" :images]
               [double-dropdown :logo "Logo" :images]
               ;[prosemirror :text @event]
               [checkbox :ausverkauft "Ausverkauft"]
               [field rc/input-text :ausverkauftText "Ausverkauft"]
               [field rc/input-text :abAlter "Mindestalter"]
               [field rc/input-text :tuerOeffnung "Türöffnung"]
               [field rc/input-text :preis "Preis"]
               ;[field rc/input-textarea :text "Beschreibung"]
               ])])

(defn events-panel []
  [rc/v-box
   :children [[rc/h-box
               :children [[rc/box :size "256px" :child [events-sidebar]]
                          [rc/box :size "1" :child [event-form]]]]]])