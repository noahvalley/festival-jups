(ns webbackend.upload
  (:require
    [reagent.core :as r]
    [webbackend.fields :refer [upload-field delete-field]]))

(defn upload [global]
  (let [image-list (r/cursor global [:images])
        file-list (r/cursor global [:files])]
    [:div {:style {:display "flex" :flex-direction "column"}}
     [upload-field global "Bild speichern" "images" (r/cursor global [:image]) image-list]
     [delete-field global "images" :delete-image :images "Bild löschen" false]
     [upload-field global "Datei speichern" "files" (r/cursor global [:file]) file-list]
     [delete-field global "files" :delete-file :files "Datei löschen" false]]))
