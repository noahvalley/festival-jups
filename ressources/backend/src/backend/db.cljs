(ns backend.db)

(def empty-event
  {:ausverkauft false
   :preis       nil
   :titel       nil
   :abAlter     nil
   :type        nil
   :ort         nil
   :untertitel  nil
   :priority    "1"
   :id          nil
   :zeitBis     (-> (js/Date.)
                    .toISOString
                    (#(first (re-seq #"....-..-..T..:.." %))))
   :zeitVon     (-> (js/Date.)
                    .toISOString
                    (#(first (re-seq #"....-..-..T..:.." %))))
   :bild        nil
   :logo        nil
   :text        nil})

(def default-db
  {:error {:error false
           :message ""}

   :active-panel nil

   :username ""
   :password ""
   :session nil

   :events []
   :changed-events [empty-event]
   :active-event nil

   :pages {}
   :changed-pages {}
   :active-page :home

   :images {}
   :files {}})
