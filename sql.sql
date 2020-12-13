CREATE TABLE actor (
    actorId character varying(10),
    aFname character varying(100),
    aLname character varying(100),
    sex character varying(5),
    phoneNo character varying(100),
    PRIMARY KEY (actorId)
);
CREATE TABLE producer (
    producerId character varying(10),
    pFname character varying(100),
    pLname character varying(100),
    PRIMARY KEY (producerId)
);
CREATE TABLE saleperson (
    userId character varying(10),
    sName character varying(100),
    sLname character varying(100),
    PRIMARY KEY (userId)
);
CREATE TABLE customer (
    customerId character varying(10),
    cName character varying(100),
    cLname character varying(100),
	cPhone character varying(100),
    cEmail character varying(100),
    PRIMARY KEY (customerId)
);

CREATE TABLE movie (
    movieId character varying(10),
    title character varying(100),
    genre character varying(100),
    copyRightDate date,
    producerId character varying(100),
	price numeric(18,2),
    PRIMARY KEY (movieId),
    CONSTRAINT movie_producer_producerId_fkey FOREIGN KEY (producerId)
        REFERENCES producer (producerId) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE rent (
    receiptno character varying(10),
	date date,
	duedate date,
	customerid character varying(10),
    salefname character varying(100),
    salelname character varying(100),
    paymentref character varying(100),
    total numeric(18,2),
    PRIMARY KEY (receiptNo),
	CONSTRAINT rent_customer_customerid_fkey FOREIGN KEY (customerid)
        REFERENCES customer (customerid) MATCH SIMPLE,
	    ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE rent_line_item (
    id integer,
    lineitem integer NOT NULL,
    receiptNo character varying(10),
    movieId character varying(10),
    unitDay integer,
    unitPrice numeric(18,2),
    extendedPrice numeric(18,2),
    CONSTRAINT rent_line_item_pkey PRIMARY KEY (receiptNo,lineitem),
    CONSTRAINT rent_line_item_movie_movieId_fkey FOREIGN KEY (movieId)
        REFERENCES movie(movieId) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE movie_actor
(
    id integer,
    lineitem integer NOT NULL,
    movieId character varying(10) NOT NULL,
    actorId character varying(10) NOT NULL,
    CONSTRAINT movie_actor_pkey PRIMARY KEY (movieId, lineitem),
    CONSTRAINT movie_actor_actor_actorId_fkey FOREIGN KEY (actorId)
        REFERENCES actor (actorId) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE payment (
    payment_code character varying(10), 
    name character varying(100), 
    PRIMARY KEY (payment_code)
);