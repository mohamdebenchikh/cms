<?php

use App\Services\DataTableService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

if (!function_exists('datatable')) {
    /**
     * Get a DataTableService instance.
     *
     * @param \Illuminate\Database\Eloquent\Builder|string|null $query
     * @param \Illuminate\Http\Request|null $request
     * @return \App\Services\DataTableService
     */
    function datatable($query = null, Request $request = null)
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
