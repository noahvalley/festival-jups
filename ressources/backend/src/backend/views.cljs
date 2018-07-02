(ns backend.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [breaking-point.core :as bp]
    [goog.date.UtcDateTime :as time]
    [backend.subs]))

(def sizes {:sidebar-width "256px"
            :input-label-width "256px"
            :input-label-gap "20px"
            :input-field-gap "20px"
            :input-field-width "512px"})

;; home

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

(defn compare-events [a b]
  (let [dateA (or (first (clojure.string/split (:zeitVon a) "T")) "0")
        dateB (or (first (clojure.string/split (:zeitVon b) "T")) "0")]
    (cond
      (< dateA dateB) -1
      (> dateA dateB) 1
      (> (:priority a) (:priority b)) 1
      (< (:priority a) (:priority b)) -1
      :default 0)))

(defn events-sidebar []
  (let [events @(rf/subscribe [:jups.backend.subs/events])]
    [:ul (for [list-event (sort compare-events events)]
           ^{:key (:id list-event)}
           [:li
            [rc/hyperlink
             :label (or (:titel list-event) "OHNE TITEL")
             :on-click #(rf/dispatch [:jups.backend.events/active-event (:id list-event)])]])]))

(defn input [label input-field]
  [rc/h-box
   :children [[rc/h-box
               :children [[rc/label
                           :label label
                           :style {:align-self "center"}]
                          [rc/gap :size (:input-label-gap sizes)]]
               :width (:input-label-width sizes)
               :style {:justify-content "flex-end"}]
               input-field]])

(defn field [type kw label]
  [input
   label
   [type
    :model (or @(rf/subscribe [:jups.backend.subs/active-event-field kw]) "")
    :on-change #(rf/dispatch [:jups.backend.events/change-event kw %])
    :width (:input-field-width sizes)]])

(defn dropdown [choices kw label]
  [input
   label
   [rc/single-dropdown
    :choices choices
    :model @(rf/subscribe [:jups.backend.subs/active-event-field kw])
    :on-change #(rf/dispatch [:jups.backend.events/change-event kw %])
    :width (:input-field-width sizes)]])

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
               [rc/gap :size (:input-field-gap sizes)]
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

(defn double-dropdown []
  [])

(defn event-form []
  [rc/v-box
   :children [[field rc/input-text :titel "Titel"]
              [field rc/input-text :untertitel "Untertitel"]
              [dropdown [{:id "workshop" :label "Workshop"}
                         {:id "veranstaltung" :label "Veranstaltung"}
                         {:id "offenesangebot" :label "Offenes Angebot"}]
               :type
               "Typ"]
              [field rc/input-text :ort "Ort"]
              [date :zeitVon "Beginn"]
              [date :zeitBis "Ende"]
              [number-field :priority "Priorität"]
              ;[double-dropdown-image global :bild :images "Bild"]
              ;[double-dropdown-image global :logo :images "Logo"]
              ;[prosemirror :text @event]
              [checkbox :ausverkauft "Ausverkauft"]
              [field rc/input-text :ausverkauftText "Ausverkauft"]
              [field rc/input-text :abAlter "Mindestalter"]
              [field rc/input-text :tuerOeffnung "Türöffnung"]
              [field rc/input-text :preis "Preis"]]])

(defn events-panel []
  [rc/v-box
   :children [[rc/box
               :align-self :center
               :child [rc/title
                       :label "EVENTS"
                       :level :level1]]
              [rc/h-box
               :children [[rc/box :size "256px" :child [events-sidebar]]
                          [rc/box :size "1" :child [event-form]]]]
              [rc/box :child [rc/label
                              :label "Footer"]]]])

(defn home-panel []
  (let [session @(rf/subscribe [:jups.backend.subs/session])]
    (if session
      [events-panel]
      [login-panel])))

;; about

(defn about-panel []
  [:div
   [:h1 "This is the About Page."]

   [:div
    [:a {:href "#/"}
     "go to Home Page"]]])


;; main

(defn- panels [panel-name]
  (case panel-name
    :login-panel [login-panel]
    :events-panel [events-panel]
    :home-panel [home-panel]
    :about-panel [about-panel]
    [:div]))

(defn show-panel [panel-name]
  [panels panel-name])

(defn main-panel []
  (let [active-panel (rf/subscribe [:jups.backend.subs/active-panel])]
    [show-panel @active-panel]))
