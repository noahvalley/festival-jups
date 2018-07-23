(ns backend.pages.views
  (:require
    [re-com.core :as rc]
    [re-frame.core :as rf]
    [backend.style :as style]
    [backend.components :as v]
    [backend.pages.codemirror :as cm]
    [reagent.core :as r]))

;; --------------------------------------
;; fields

(defn pages-text-field [kw label]
  [v/label-and-input
   label
   [v/text-field
    (rf/subscribe [:jups.backend.subs/active-page-field kw])
    #(rf/dispatch [:jups.backend.events/change-page kw %])]])

(defn pages-textarea-field [kw label]
  [v/label-and-input
   label
   [v/textarea-field
    (rf/subscribe [:jups.backend.subs/active-page-field kw])
    #(rf/dispatch [:jups.backend.events/change-page kw %])
    7]])

(defn pages-checkbox [kw label]
  [v/label-and-input
   label
   [v/checkbox
    (rf/subscribe [:jups.backend.subs/active-page-field kw])
    #(rf/dispatch [:jups.backend.events/change-page kw %])]])

(defn pages-double-dropdown [list-kw label]
  [v/label-and-input
   label
   [rc/v-box
    :width (:input-field-width style/sizes)
    :children [[v/double-dropdown
                {:upper-choices-atom (rf/subscribe [:jups.backend.subs/years-dropdown list-kw])
                 :upper-choice-atom  (rf/subscribe [:jups.backend.subs/page-year list-kw])
                 :upper-dispatch-fn  #(rf/dispatch [:jups.backend.events/page-year list-kw %])
                 :lower-choices-atom (rf/subscribe [:jups.backend.subs/files-dropdown
                                                    list-kw
                                                    @(rf/subscribe [:jups.backend.subs/page-year list-kw])])
                 :lower-choice-atom  (rf/subscribe [:jups.backend.subs/page-file list-kw])
                 :lower-dispatch-fn  #(rf/dispatch [:jups.backend.events/page-file list-kw %])}]]]])

(defn pages-image-from-dropdown []
  (let [url @(rf/subscribe [:jups.backend.subs/pages-file-url :images])]
    (if (= 2 (count (clojure.string/split url "/")))
      [v/image-from-url (str "http://api.festival-jups.ch/images/" url)])))

(defn image-link []
  (let [url @(rf/subscribe [:jups.backend.subs/pages-file-url :images])]
    (if (and url (= 2 (count (clojure.string/split url "/"))))
      [rc/label
       :label (str "<img src=\"" "http://api.festival-jups.ch/images/" url "\">")])))

(defn file-link []
  (let [url @(rf/subscribe [:jups.backend.subs/pages-file-url :files])]
    (if (and url (= 2 (count (clojure.string/split url "/"))))
      [rc/label
       :label (str "<a href=\"" "http://api.festival-jups.ch/files/" url "\" target=\"_blank\"></a>")])))

;; ------------------------------------
;; layout

(defn pages-sidebar []
  (let [pages @(rf/subscribe [:jups.backend.subs/pages])
        changed-pages @(rf/subscribe [:jups.backend.subs/changed-pages])]
    [rc/v-box
     :children (for [page pages]
                 ^{:key (key page)}
                 [rc/h-box
                  :align :center
                  :children (interpose
                              [rc/gap :size (:vertical-gap style/sizes)]
                              [[rc/hyperlink
                                :style (let [changed-page @(rf/subscribe [:jups.backend.subs/changed-page (key page)])]
                                         {:color (if (= (val page) changed-page)
                                                   "black"
                                                   "darkred")})
                                :label (name (key page))
                                :on-click #(rf/dispatch [:jups.backend.events/active-page (key page)])]])])]))

(defn pages-form []
  (let [active-page-name @(rf/subscribe [:jups.backend.subs/active-page-name])
        cm-content (rf/subscribe [:jups.backend.subs/active-page-field :content])
        cm-content-deref @cm-content                        ;force codemirror to update
        cm-update #(rf/dispatch [:jups.backend.events/change-page :content %])]
    [rc/v-box
     :children (interpose
                 [rc/gap :size (:vertical-gap style/sizes)]
                 (concat
                   (case active-page-name
                     :tickets [[pages-checkbox :showText "Text anzeigen"]
                               [pages-checkbox :showForm "Formular anzeigen"]
                               [pages-textarea-field :contentFormSent "Text wenn Formular gesendet"]]
                     :programm [[pages-checkbox :showText "Text anzeigen"]
                                [pages-checkbox :showProgramm "Programm anzeigen"]]
                     [])
                   [[pages-double-dropdown :images "Bild-Link"]
                    [v/label-and-input "" [image-link]]
                    [v/label-and-input "" [pages-image-from-dropdown]]
                    [pages-double-dropdown :files "Datei-Link"]
                    [v/label-and-input "" [file-link]]
                    [:div]                                  ;solves the problem of multiple codemirrors in :tickets-form
                    [v/label-and-input
                     "Inhalt"
                     [cm/cm-editor
                      cm-content
                      cm-update]]]))]))

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
  [v/panel {:buttons pages-buttons
            :sidebar pages-sidebar
            :form pages-form}])
