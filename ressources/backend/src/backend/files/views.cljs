(ns backend.files.views
  (:require
    [re-frame.core :as rf]
    [re-com.core :as rc]
    [backend.style :as style]
    [backend.components :as v]))

(defn upload-field [list-kw label]
  (let [files (atom nil)]
    [v/label-and-input
     label
     [rc/h-box
      :children [[:input {:class     "form-control"
                          :multiple  true
                          :name      type
                          :type      "file"
                          :on-change (fn [e]
                                       (.persist e)
                                       (let [selected-files
                                             (for [i (range (-> e
                                                                .-target
                                                                .-files
                                                                .-length))]
                                               (.item
                                                 (-> e
                                                     .-target
                                                     .-files)
                                                 i))]
                                         (reset! files selected-files)))}]
                 [rc/gap :size (:horizontal-gap style/sizes)]
                 [rc/button
                  :label "upload"
                  :on-click #(rf/dispatch [:jups.backend.events/upload-files list-kw files])]]]]))

(defn delete-field [list-kw label]
  [v/label-and-input
   label
   [rc/h-box
    :children [[v/double-dropdown
                {:upper-choices-atom (rf/subscribe [:jups.backend.subs/years-dropdown list-kw])
                 :upper-choice-atom  (rf/subscribe [:jups.backend.subs/files-year list-kw])
                 :upper-dispatch-fn  #(rf/dispatch [:jups.backend.events/files-year list-kw %])
                 :lower-choices-atom (rf/subscribe [:jups.backend.subs/files-dropdown
                                                    list-kw
                                                    @(rf/subscribe [:jups.backend.subs/files-year list-kw])])
                 :lower-choice-atom (rf/subscribe [:jups.backend.subs/files-file list-kw])
                 :lower-dispatch-fn #(rf/dispatch [:jups.backend.events/files-file list-kw %])}]
               [rc/gap :size (:horizontal-gap style/sizes)]
               [rc/button
                :label "löschen"
                :on-click #(rf/dispatch [:jups.backend.events/->delete-file list-kw])]]]])

(defn images-upload []
  [upload-field :images "Bilder hochladen"])

(defn files-upload []
  [upload-field :files "Dateien hochladen"])

(defn images-delete []
  [delete-field :images "Bild löschen"])

(defn files-delete []
  [delete-field :files "Datei löschen"])


(defn files-sidebar []
  (let [pages @(rf/subscribe [:jups.backend.subs/pages])]
    [:ul
     [:li
      [rc/hyperlink
       :label "OHNE TITEL"]]]))

(defn files-form []
  [rc/v-box
   :children (interpose
               [rc/gap :size (:vertical-gap style/sizes)]
               [[images-upload]
                [images-delete]
                [rc/gap :size (:vertical-gap style/sizes)]
                [files-upload]
                [files-delete]])])

(defn files-panel []
  [v/panel
   {:buttons (fn [] [rc/gap :size (:vertical-gap style/sizes)])
    :sidebar (fn [] [rc/gap :size (:sidebar-width style/sizes)])
    :form    files-form}])