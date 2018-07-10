(ns backend.db)

(def default-db
  {:active-panel nil
   :error {:error false
           :message ""}
   :username ""
   :password ""
   :session nil
   :pages {}
   :events []
   :images {}
   :files {}
   :changed-events []
   :active-event nil})

(def empty-event
  {:ausverkauft false
   :preis       ""
   :titel       ""
   :abAlter     ""
   :type        ""
   :ort         ""
   :untertitel  ""
   :priority    "1"
   :id          nil
   :zeitBis     "2000-12-31T23:42"
   :zeitVon     "2000-12-31T23:42"
   :bild        nil
   :logo        nil
   :text        ""})