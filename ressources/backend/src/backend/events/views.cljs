(ns backend.events.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [goog.date.UtcDateTime :as time]
    [backend.components :as v]
    [backend.style :as style]
    [backend.events.prosemirror :as pm]))

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

(defn event-text-field [kw label]
  [v/label-and-input
   label
   [v/text-field
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn event-dropdown [kw label choices]
  [v/label-and-input
   label
   [v/dropdown
    choices
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn event-checkbox [kw label]
  [v/label-and-input
   label
   [v/checkbox
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw %])]])

(defn event-date [kw label]
  [v/label-and-input
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

(defn event-number-field [kw label]
  [v/label-and-input
   label
   [v/number-field
    (rf/subscribe [:jups.backend.subs/active-event-field kw])
    #(rf/dispatch [:jups.backend.events/change-event kw (-> % .-target .-value)])]])

(defn event-double-dropdown [kw label list-kw]
  [v/label-and-input
   label
   [rc/v-box
    :width (:input-field-width style/sizes)
    :children [[v/double-dropdown
                {:upper-choices-atom (rf/subscribe [:jups.backend.subs/years-dropdown list-kw])
                 :upper-choice-atom  (rf/subscribe [:jups.backend.subs/active-event-image-year kw])
                 :upper-dispatch-fn  #(rf/dispatch [:jups.backend.events/event-years-dropdown kw %])
                 :lower-choices-atom (rf/subscribe [:jups.backend.subs/files-dropdown
                                                    list-kw
                                                    @(rf/subscribe [:jups.backend.subs/active-event-image-year kw])])
                 :lower-choice-atom  (rf/subscribe [:jups.backend.subs/active-event-image-file kw])
                 :lower-dispatch-fn  #(rf/dispatch [:jups.backend.events/event-files-dropdown kw %])

                 }]
               (let [url @(rf/subscribe [:jups.backend.subs/active-event-field kw])]
                 (if (= 2 (count (clojure.string/split url "/")))
                   [v/image-from-url (str "http://api.festival-jups.ch/" (name list-kw) "/" url)]))]]])

;; -----------------------------------------------
;; event form layout

(defn events-sidebar []
  (let [events @(rf/subscribe [:jups.backend.subs/events])
        changed-events @(rf/subscribe [:jups.backend.subs/changed-events])
        active-event-id @(rf/subscribe [:jups.backend.subs/active-event-id])]
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
                                :style (merge
                                         (let [changed-event @(rf/subscribe [:jups.backend.subs/changed-event (:id event)])]
                                          {:color (if (or (= event changed-event)
                                                          (nil? changed-event))
                                                    "black"
                                                    "darkred")})
                                         (if (= (:id event) active-event-id)
                                           {:text-decoration "underline"}))
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
                  [v/label-and-input ""
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
                [event-date :zeitVon "Beginn"]
                [event-date :zeitBis "Ende"]
                [event-number-field :priority "Priorität"]
                [event-double-dropdown :bild "Bild" :images]
                [event-double-dropdown :logo "Logo" :images]
                [v/label-and-input
                 "Beschreibung"
                 [pm/prosemirror @(rf/subscribe [:jups.backend.subs/active-event-field :text])]]
                [event-checkbox :ausverkauft "Ausverkauft"]
                [event-text-field :ausverkauftText "Ausverkauft"]
                [event-text-field :eventfroglink "eventfrog.ch/"]
                [event-text-field :abAlter "Mindestalter"]
                [event-text-field :tuerOeffnung "Türöffnung"]
                [event-text-field :preis "Preis"]
                #_[v/label-and-input "Beschreibung" [v/textarea-field
                                                   (rf/subscribe [:jups.backend.subs/active-event-field :text])
                                                   #(rf/dispatch [:jups.backend.events/change-event :text %])
                                                   7]]])])

(defn events-buttons []
  (let [active-event-id @(rf/subscribe [:jups.backend.subs/active-event-id])]
    [rc/h-box
     :justify :center
     :children (interpose
                 [rc/gap :size (:vertical-gap style/sizes)]
                 [[rc/button
                   :label "Event speichern"
                   :on-click (fn []
                               (rf/dispatch [:jups.backend.events/change-event :text (pm/get-html-string)])
                               (if (nil? active-event-id)
                                (rf/dispatch [:jups.backend.events/->create-event active-event-id])
                                (rf/dispatch [:jups.backend.events/->update-event active-event-id])))]
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
  [v/panel {:buttons events-buttons
            :sidebar events-sidebar
            :form event-form}])
