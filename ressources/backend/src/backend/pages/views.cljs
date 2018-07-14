(ns backend.pages.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [backend.style :as style]))

(defn pages-sidebar []
  (let [pages @(rf/subscribe [:jups.backend.subs/pages])]
    [rc/v-box
     :children (for [page pages]
                 ^{:key (key page)}
                 [rc/h-box
                  :align :center
                  :children (interpose
                              [rc/gap :size (:vertical-gap style/sizes)]
                              [[rc/hyperlink
                                :style (let [changed-page @(rf/subscribe [:jups.backend.subs/changed-page (key page)])]
                                         {:color (if (= page changed-page)
                                                   "black"
                                                   "darkred")})
                                :label (name (key page))
                                :on-click #(rf/dispatch [:jups.backend.events/active-page (key page)])]])])]))

(defn pages-form []
  (let [active-page-name @(rf/subscribe [:jups.backend.subs/active-page-name])]
    [rc/v-box
     :children (interpose
                 [rc/gap :size (:vertical-gap style/sizes)]
                 (into
                   (case active-page-name
                    :home []
                    :orte []
                    :kontakt []
                    :archiv []
                    :downloads []
                    :tickets [:showText "Text anzeigen"
                              :showForm "Formular anzeigen"
                              :contentFormSent "Text wenn Formular gesendet"
                              ]
                    :programm [:showText "Text anzeigen"
                               :showProgramm "Programm anzeigen"]
                    [
                     ;[field rc/input-text :titel "Titel"]
                     ;[field rc/input-text :untertitel "Untertitel"]
                     #_[dropdown
                        :type
                        "Typ"
                        [{:id "workshop" :label "Workshop"}
                         {:id "veranstaltung" :label "Veranstaltung"}
                         {:id "offenesangebot" :label "Offenes Angebot"}]]
                     ;[field rc/input-text :ort "Ort"]
                     ;[date :zeitVon "Beginn"]
                     ;[date :zeitBis "Ende"]
                     ;[number-field :priority "Priorität"]
                     ;[double-dropdown :bild "Bild" :images]
                     ;[double-dropdown :logo "Logo" :images]
                     ;[prosemirror :text @event]
                     ;[checkbox :ausverkauft "Ausverkauft"]
                     ;[field rc/input-text :ausverkauftText "Ausverkauft"]
                     ;[field rc/input-text :abAlter "Mindestalter"]
                     ;[field rc/input-text :tuerOeffnung "Türöffnung"]
                     ;[field rc/input-text :preis "Preis"]
                     ;[field rc/input-textarea :text "Beschreibung"]
                     ])
                   [[double-dropdown :images]
                    [double-dropdown :files]
                    [codemirror]]))]))

(defn pages-buttons []
  (let [active-page-name @(rf/subscribe [:jups.backend.subs/active-page-name])]
    [rc/h-box
     :justify :center
     :children (interpose
                 [rc/gap :size (:vertical-gap style/sizes)]
                 [[rc/button
                   :label "Page speichern"
                   :on-click #(rf/dispatch [:jups.backend.events/->update-page active-page-name])]
                  [rc/button
                   :label "Änderungen an Page verwerfen"
                   :on-click #(rf/dispatch [:jups.backend.events/page-discard-changes active-page-name])]])]))

(defn pages-panel []
  [rc/v-box
   :children [[rc/v-box
               :children [[pages-buttons]
                          [rc/gap :size (:vertical-gap style/sizes)]
                          [rc/h-box
                           :children (interleave
                                       (repeat [rc/gap :size (:vertical-gap style/sizes)])
                                       [[rc/box :size "256px" :child [pages-sidebar]]
                                        [rc/box :size "1" :child [pages-form]]])]]]]])

#_(defn pages-form [global]
  (let [session (r/cursor global [:session])
        page (name (:selected-page @global))]
    [:div {:style {:display        "flex"
                   :flex-direction "column"}}

     (cond (#{"home" "orte" "kontakt" "archiv" "downloads"} [page]) nil
           (= "tickets" page) (let [tickets (r/cursor global [:pages :tickets])]
                                [:div
                                 [checkbox
                                  :showText
                                  "Text anzeigen"
                                  tickets]
                                 [checkbox
                                  :showForm
                                  "Formular anzeigen"
                                  tickets]
                                 [field
                                  "text"
                                  :contentFormSent
                                  "Text wenn Formular gesendet"
                                  tickets]])
           (= "programm" page) [:div
                                [checkbox
                                 :showText
                                 "Text anzeigen"
                                 (r/cursor global [:pages :programm])]
                                [checkbox
                                 :showProgramm
                                 "Programm anzeigen"
                                 (r/cursor global [:pages :programm])]])
     [:div {:style {:display "flex" :flex-direction "row"}}
      [double-dropdown global :pages-image :images "Bild" false]
      (if (and (:pages-image @global)
               (not (= "" (:pages-image @global))))
        [:p (str "<img src=\"" "http://api.festival-jups.ch/images/" (:pages-image @global) "\">")])]
     [:div {:style {:display "flex" :flex-direction "row"}}
      [double-dropdown global :pages-file :files "Datei" false]
      (if (and (:pages-file @global)
               (not (= "" (:pages-file @global))))
        [:p (str "<a href=\"" "http://api.festival-jups.ch/files/"  (:pages-file @global) "\" target=\"_blank\"></a>")])]
     [codemirror
      (-> @global
          :pages
          ((or (:selected-page @global) :home))
          :content)]]))
