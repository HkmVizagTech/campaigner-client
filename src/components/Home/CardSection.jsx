import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCampainer } from "@/store/campaigners/campaigners.service";
import CustomCard from "../utils/CustomCard";
import CustomCardSkeleton from "../utils/CustomCardSkeleton";
import { Input } from "../ui/input";

const PAGE_SIZE = 15;
const INITIAL_QUERY = {
  page: 1,
  search: "",
};

const queryReducer = (state, action) => {
  switch (action.type) {
    case "RESET_PAGE":
      if (state.page === INITIAL_QUERY.page) {
        return state;
      }

      return {
        ...state,
        page: INITIAL_QUERY.page,
      };

    case "SET_SEARCH":
      if (
        state.search === action.payload &&
        state.page === INITIAL_QUERY.page
      ) {
        return state;
      }

      return {
        page: INITIAL_QUERY.page,
        search: action.payload,
      };

    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };

    default:
      return state;
  }
};

const CardSection = ({ currentCampaign }) => {
  const dispatch = useDispatch();

  const {
    campainersCount,
    campaginers,
    campainerLoading,
    campaginerTotalPages,
  } = useSelector((state) => state.campaginer);

  const [searchInput, setSearchInput] = useState("");
  const [query, dispatchQuery] = useReducer(queryReducer, INITIAL_QUERY);

  const loaderRef = useRef(null);
  const isFetchingNextPageRef = useRef(false);

  const hasMoreCampaigners = useMemo(() => {
    if (campaginerTotalPages > 0) {
      return query.page < campaginerTotalPages;
    }

    return campaginers.length < campainersCount;
  }, [campaginerTotalPages, campaginers.length, campainersCount, query.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedSearch = searchInput.trim();

      dispatchQuery({
        type: "SET_SEARCH",
        payload: normalizedSearch,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatchQuery({ type: "RESET_PAGE" });
  }, [currentCampaign?._id]);

  useEffect(() => {
    isFetchingNextPageRef.current = campainerLoading;
  }, [campainerLoading]);

  useEffect(() => {
    if (!currentCampaign?._id) return undefined;

    const request = dispatch(
      getCampainer({
        id: currentCampaign._id,
        status: "active",
        campStatus: "active",
        page: query.page,
        pageSize: PAGE_SIZE,
        search: query.search,
        infiniteScroll: true,
      }),
    );

    return () => {
      request.abort();
    };
  }, [currentCampaign?._id, dispatch, query]);

  useEffect(() => {
    const currentLoader = loaderRef.current;

    if (!currentLoader || !currentCampaign?._id || !hasMoreCampaigners) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || isFetchingNextPageRef.current) return;

        if (campaginerTotalPages > 0 && query.page >= campaginerTotalPages) {
          return;
        }

        isFetchingNextPageRef.current = true;
        dispatchQuery({ type: "LOAD_NEXT_PAGE" });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(currentLoader);

    return () => {
      observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [
    campaginerTotalPages,
    currentCampaign?._id,
    hasMoreCampaigners,
    query.page,
  ]);

  return (
    <section className="mt-10" id="card-sections">
      <div className="flex gap-2 flex-col md:flex-row justify-between mb-5 px-2">
        <h2 className="text md:text-2xl font-semibold">
          Campaigners Supporting This Seva ({campainersCount})
        </h2>

        {campaginers?.length > 5 && (
          <Input
            placeholder="Search campaigner..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-sm"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch mb-3">
        {campaginers?.map((campaginer, index) => (
          <CustomCard
            key={campaginer?._id}
            campainer={campaginer}
            index={index}
          />
        ))}

        {campainerLoading &&
          Array.from({ length: Math.min(PAGE_SIZE, 4) }).map((_, i) => (
            <CustomCardSkeleton key={i} />
          ))}
      </div>

      {hasMoreCampaigners && <div ref={loaderRef} className="h-10" />}

      {!campainerLoading && campaginers?.length === 0 && (
        <p>No Campaigners Found.</p>
      )}
    </section>
  );
};

export default CardSection;
