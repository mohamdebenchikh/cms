<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

if (!function_exists('datatable')) {
    /**
     * Get a DataTableService instance.
     *
     * @param \Illuminate\Database\Eloquent\Builder|string|null $query
     * @param \Illuminate\Http\Request|null $request
     * @return \App\Services\DataTableService
     */
    function datatable(Builder|string|null $query = null, ?Request $request = null)
    {
        $request = $request ?: app(Request::class);

        if (is_null($query)) {
            return app('datatable');
        }

        if (is_string($query)) {
            return DataTableService::fromModel($query, $request);
        }

        return new DataTableService($query, $request);
    }
}

class DataTableService
{
    /**
     * The query builder instance.
     *
     * @var \Illuminate\Database\Eloquent\Builder
     */
    protected $query;

    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * The default sort field.
     *
     * @var string
     */
    protected $defaultSortField = 'created_at';

    /**
     * The default sort direction.
     *
     * @var string
     */
    protected $defaultSortDirection = 'desc';

    /**
     * The default per page value.
     *
     * @var int
     */
    protected $defaultPerPage = 10;

    /**
     * The searchable fields.
     *
     * @var array
     */
    protected $searchableFields = [];

    /**
     * Create a new DataTable service instance.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    public function __construct(Builder $query, Request $request)
    {
        $this->query = $query;
        $this->request = $request;
    }

    /**
     * Set the default sort field.
     *
     * @param string $field
     * @return $this
     */
    public function setDefaultSortField(string $field): self
    {
        $this->defaultSortField = $field;
        return $this;
    }

    /**
     * Set the default sort direction.
     *
     * @param string $direction
     * @return $this
     */
    public function setDefaultSortDirection(string $direction): self
    {
        $this->defaultSortDirection = $direction;
        return $this;
    }

    /**
     * Set the default per page value.
     *
     * @param int $perPage
     * @return $this
     */
    public function setDefaultPerPage(int $perPage): self
    {
        $this->defaultPerPage = $perPage;
        return $this;
    }

    /**
     * Set the searchable fields.
     *
     * @param array $fields
     * @return $this
     */
    public function setSearchableFields(array $fields): self
    {
        $this->searchableFields = $fields;
        return $this;
    }

    /**
     * Apply search to the query.
     *
     * @param string|null $search
     * @return $this
     */
    public function applySearch(?string $search): self
    {
        if ($search && !empty($this->searchableFields)) {
            $this->query->where(function ($query) use ($search) {
                foreach ($this->searchableFields as $field) {
                    if (str_contains($field, '.')) {
                        // Handle relationship fields (e.g., 'author.name')
                        [$relation, $relationField] = explode('.', $field, 2);
                        $query->orWhereHas($relation, function ($q) use ($relationField, $search) {
                            $q->where($relationField, 'like', "%{$search}%");
                        });
                    } else {
                        // Handle regular fields
                        $query->orWhere($field, 'like', "%{$search}%");
                    }
                }
            });
        }

        return $this;
    }

    /**
     * Apply sorting to the query.
     *
     * @param string|null $sortField
     * @param string|null $sortDirection
     * @return $this
     */
    public function applySort(?string $sortField = null, ?string $sortDirection = null): self
    {
        $sortField = $sortField ?: $this->defaultSortField;
        $sortDirection = $sortDirection ?: $this->defaultSortDirection;

        // Validate sort direction
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = $this->defaultSortDirection;
        }

        // Apply sorting
        if (str_contains($sortField, '.')) {
            // Handle relationship sorting (e.g., 'author.name')
            [$relation, $relationField] = explode('.', $sortField, 2);

            // Check if the relationship is a many-to-many relationship
            $model = $this->query->getModel();
            $relationMethod = $relation;

            if (method_exists($model, $relationMethod)) {
                $relationObj = $model->{$relationMethod}();

                // Handle different relationship types
                if ($relationObj instanceof \Illuminate\Database\Eloquent\Relations\BelongsTo) {
                    // For BelongsTo relationships (e.g., user belongs to a role)
                    $foreignKey = $relationObj->getForeignKeyName();
                    $relatedTable = $relationObj->getRelated()->getTable();

                    $this->query->join(
                        $relatedTable,
                        $model->getTable() . '.' . $foreignKey,
                        '=',
                        $relatedTable . '.id'
                    )
                    ->orderBy($relatedTable . '.' . $relationField, $sortDirection)
                    ->select($model->getTable() . '.*'); // Select only from the main table

                    // Mark sorting as applied
                    $this->sortingApplied = true;
                }
                elseif ($relationObj instanceof \Illuminate\Database\Eloquent\Relations\BelongsToMany) {
                    // For BelongsToMany relationships (e.g., user has many roles)
                    $pivotTable = $relationObj->getTable();
                    $relatedTable = $relationObj->getRelated()->getTable();
                    $foreignPivotKey = $relationObj->getForeignPivotKeyName();
                    $relatedPivotKey = $relationObj->getRelatedPivotKeyName();

                    $this->query->join(
                        $pivotTable,
                        $model->getTable() . '.id',
                        '=',
                        $pivotTable . '.' . $foreignPivotKey
                    )
                    ->join(
                        $relatedTable,
                        $pivotTable . '.' . $relatedPivotKey,
                        '=',
                        $relatedTable . '.id'
                    )
                    ->orderBy($relatedTable . '.' . $relationField, $sortDirection)
                    ->select($model->getTable() . '.*') // Select only from the main table
                    ->distinct(); // Avoid duplicates

                    // Mark sorting as applied
                    $this->sortingApplied = true;
                }
                elseif ($relationObj instanceof \Illuminate\Database\Eloquent\Relations\HasOneOrMany) {
                    // For HasOne/HasMany relationships (e.g., user has many posts)
                    $foreignKey = $relationObj->getForeignKeyName();
                    $relatedTable = $relationObj->getRelated()->getTable();

                    $this->query->join(
                        $relatedTable,
                        $model->getTable() . '.id',
                        '=',
                        $relatedTable . '.' . $foreignKey
                    )
                    ->orderBy($relatedTable . '.' . $relationField, $sortDirection)
                    ->select($model->getTable() . '.*'); // Select only from the main table

                    // Mark sorting as applied
                    $this->sortingApplied = true;
                }
            } else {
                // Fallback to simple join if relationship method doesn't exist
                $this->query->join(
                    $relation,
                    $this->query->getModel()->getTable() . '.' . $relation . '_id',
                    '=',
                    $relation . '.id'
                )
                ->orderBy($relation . '.' . $relationField, $sortDirection)
                ->select($this->query->getModel()->getTable() . '.*'); // Select only from the main table

                // Mark sorting as applied
                $this->sortingApplied = true;
            }
        } else {
            // Regular field sorting
            $this->query->orderBy($sortField, $sortDirection);

            // Mark sorting as applied
            $this->sortingApplied = true;
        }

        return $this;
    }

    /**
     * Apply pagination to the query.
     *
     * @param int|null $perPage
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function paginate(?int $perPage = null): LengthAwarePaginator
    {
        $perPage = $perPage ?: $this->defaultPerPage;

        return $this->query->paginate($perPage)->withQueryString();
    }

    /**
     * Flag to indicate if sorting has been applied
     *
     * @var bool
     */
    protected $sortingApplied = false;

    /**
     * Process the query with search, sort, and pagination.
     *
     * @return array
     */
    public function process(): array
    {
        // Get parameters from request
        $search = $this->request->input('search');
        $sortField = $this->request->input('sort_field', $this->defaultSortField);
        $sortDirection = $this->request->input('sort_direction', $this->defaultSortDirection);
        $perPage = (int) $this->request->input('per_page', $this->defaultPerPage);

        // Apply search
        $this->applySearch($search);

        // Apply sorting if not already applied
        if (!$this->sortingApplied) {
            $this->applySort($sortField, $sortDirection);
        }

        // Get paginated results
        $results = $this->paginate($perPage);

        // Return results and filters
        return [
            'data' => $results,
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
                'page' => $this->request->input('page', 1)
            ]
        ];
    }

    /**
     * Create a new DataTable instance from a model.
     *
     * @param string $model
     * @param \Illuminate\Http\Request $request
     * @return self
     */
    public static function fromModel(string $model, Request $request): self
    {
        return new self($model::query(), $request);
    }
}
